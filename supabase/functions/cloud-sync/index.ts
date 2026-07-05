import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type SyncAction = "health" | "setup" | "push" | "pull" | "sync";
type ErrorCode =
  | "missing_env"
  | "invalid_payload"
  | "setup_failed"
  | "upsert_entries_failed"
  | "upsert_dishes_failed"
  | "pull_failed"
  | "db_error"
  | "unexpected_error";

type SyncBody = {
  action?: string;
  sync_code?: string;
  device_id?: string;
  entries?: unknown[];
  dishes?: unknown[];
  since?: string | null;
};

type SyncPayload = Record<string, unknown> & {
  id?: unknown;
  local_id?: unknown;
  date?: unknown;
  updatedAt?: unknown;
  createdAt?: unknown;
};

type SyncRow = {
  sync_space_id: string;
  local_id: string;
  payload: SyncPayload;
  source_device: string | null;
  updated_at: string;
  deleted_at: null;
  entry_date?: string | null;
};

type EnvState = {
  supabaseUrl: string;
  serviceRoleKey: string;
  pepper: string;
};

const allowedActions = new Set<SyncAction>(["health", "setup", "push", "pull", "sync"]);
const maxItemsPerRequest = 1000;

class CloudSyncError extends Error {
  errorCode: ErrorCode;
  detail: string;
  status: number;

  constructor(errorCode: ErrorCode, detail: string, status = 500, cause?: unknown) {
    super(safeDetail(detail));
    this.name = "CloudSyncError";
    this.errorCode = errorCode;
    this.detail = safeDetail(detail);
    this.status = status;
    if (cause instanceof Error && cause.stack) {
      this.stack = cause.stack;
    }
  }
}

function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("origin") || "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  return /^https:\/\/[a-z0-9-]+\.github\.io$/i.test(origin)
    || /^http:\/\/localhost(?::\d+)?$/i.test(origin)
    || /^http:\/\/127\.0\.0\.1(?::\d+)?$/i.test(origin);
}

function jsonResponse(request: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), "Content-Type": "application/json; charset=utf-8" },
  });
}

function safeDetail(value: unknown, maxLength = 220): string {
  const text = String(value || "Cloud sync failed").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : safeDetail(error);
}

function toCloudSyncError(error: unknown): CloudSyncError {
  if (error instanceof CloudSyncError) return error;
  return new CloudSyncError("unexpected_error", getErrorMessage(error), 500, error);
}

function normalizeSyncCode(value: unknown): string {
  return String(value || "").trim().replace(/\s+/g, " ").toUpperCase();
}

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function sanitizeDeviceId(value: unknown): string | null {
  const text = String(value || "").trim();
  if (!text) return null;
  return text.slice(0, 120);
}

function readEnvState(): EnvState {
  return {
    supabaseUrl: Deno.env.get("SUPABASE_URL") || "",
    serviceRoleKey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
    pepper: Deno.env.get("SYNC_CODE_PEPPER") || "",
  };
}

function missingEnvNames(env: EnvState): string[] {
  const missing: string[] = [];
  if (!env.supabaseUrl) missing.push("SUPABASE_URL");
  if (!env.serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!env.pepper) missing.push("SYNC_CODE_PEPPER");
  return missing;
}

function assertRequiredEnv(env: EnvState): void {
  const missing = missingEnvNames(env);
  if (missing.length) {
    throw new CloudSyncError("missing_env", `Missing env: ${missing.join(", ")}`, 500);
  }
}

function readPayloadArray(value: unknown, fieldName: "entries" | "dishes"): SyncPayload[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    throw new CloudSyncError("invalid_payload", `${fieldName} must be an array`, 400);
  }
  if (value.length > maxItemsPerRequest) {
    throw new CloudSyncError("invalid_payload", `${fieldName} exceeds limit ${maxItemsPerRequest}`, 400);
  }
  const invalidIndex = value.findIndex((item) => !item || typeof item !== "object" || Array.isArray(item));
  if (invalidIndex >= 0) {
    throw new CloudSyncError("invalid_payload", `${fieldName}[${invalidIndex}] must be an object`, 400);
  }
  return value as SyncPayload[];
}

function readLocalId(item: SyncPayload): string | null {
  const value = typeof item.local_id === "string" ? item.local_id : item.id;
  const text = String(value || "").trim();
  return text || null;
}

function assertLocalIds(fieldName: "entries" | "dishes", items: SyncPayload[]): void {
  const invalidIndex = items.findIndex((item) => !readLocalId(item));
  if (invalidIndex >= 0) {
    throw new CloudSyncError("invalid_payload", `${fieldName}[${invalidIndex}] is missing id/local_id`, 400);
  }
}

function readPayloadTimestamp(item: SyncPayload, fallback: string): string {
  const value = typeof item.updatedAt === "string"
    ? item.updatedAt
    : typeof item.createdAt === "string" ? item.createdAt : "";
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : fallback;
}

function toEntryRows(syncSpaceId: string, entries: SyncPayload[], deviceId: string | null, now: string): SyncRow[] {
  assertLocalIds("entries", entries);
  return entries.map((entry) => ({
    sync_space_id: syncSpaceId,
    local_id: readLocalId(entry) as string,
    entry_date: typeof entry.date === "string" ? entry.date : null,
    payload: entry,
    source_device: deviceId,
    deleted_at: null,
    updated_at: readPayloadTimestamp(entry, now),
  }));
}

function toDishRows(syncSpaceId: string, dishes: SyncPayload[], deviceId: string | null, now: string): SyncRow[] {
  assertLocalIds("dishes", dishes);
  return dishes.map((dish) => ({
    sync_space_id: syncSpaceId,
    local_id: readLocalId(dish) as string,
    payload: dish,
    source_device: deviceId,
    deleted_at: null,
    updated_at: readPayloadTimestamp(dish, now),
  }));
}

async function ensureSyncSpace(supabase: ReturnType<typeof createClient>, codeHash: string): Promise<string> {
  const { data, error } = await supabase
    .from("sync_spaces")
    .upsert({ code_hash: codeHash, updated_at: new Date().toISOString() }, { onConflict: "code_hash" })
    .select("id")
    .single();
  if (error) {
    throw new CloudSyncError("setup_failed", `sync_spaces upsert failed: ${error.message}`, 500, error);
  }
  if (!data?.id) {
    throw new CloudSyncError("setup_failed", "sync_spaces upsert returned no id", 500);
  }
  return data.id as string;
}

async function upsertRows(
  supabase: ReturnType<typeof createClient>,
  table: "sync_entries" | "sync_dishes",
  rows: SyncRow[],
  errorCode: "upsert_entries_failed" | "upsert_dishes_failed",
): Promise<void> {
  if (!rows.length) return;
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: "sync_space_id,local_id" });
  if (error) {
    throw new CloudSyncError(errorCode, `${table} upsert failed: ${error.message}`, 500, error);
  }
}

async function pullPayloads(
  supabase: ReturnType<typeof createClient>,
  table: "sync_entries" | "sync_dishes",
  syncSpaceId: string,
  since: string | null | undefined,
): Promise<SyncPayload[]> {
  let query = supabase
    .from(table)
    .select("payload,updated_at")
    .eq("sync_space_id", syncSpaceId)
    .is("deleted_at", null)
    .order("updated_at", { ascending: true });

  if (since && Number.isFinite(Date.parse(since))) {
    query = query.gt("updated_at", new Date(Date.parse(since)).toISOString());
  }

  const { data, error } = await query;
  if (error) {
    throw new CloudSyncError("pull_failed", `${table} pull failed: ${error.message}`, 500, error);
  }
  return (data || [])
    .map((row) => row.payload)
    .filter((payload): payload is SyncPayload => Boolean(payload) && typeof payload === "object" && !Array.isArray(payload));
}

async function checkTableAccess(supabase: ReturnType<typeof createClient>, table: string): Promise<void> {
  const { error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .limit(1);
  if (error) {
    throw new CloudSyncError("db_error", `${table} table check failed: ${error.message}`, 500, error);
  }
}

async function handleHealth(request: Request, env: EnvState, serverTime: string): Promise<Response> {
  const checks = {
    sync_code_pepper: Boolean(env.pepper),
    supabase_url: Boolean(env.supabaseUrl),
    service_role: Boolean(env.serviceRoleKey),
    tables: false,
  };
  const missing = missingEnvNames(env);
  if (missing.length) {
    return jsonResponse(request, {
      ok: false,
      checks,
      error_code: "missing_env",
      server_time: serverTime,
    }, 500);
  }

  try {
    const supabase = createClient(env.supabaseUrl, env.serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    await Promise.all([
      checkTableAccess(supabase, "sync_spaces"),
      checkTableAccess(supabase, "sync_entries"),
      checkTableAccess(supabase, "sync_dishes"),
    ]);
    checks.tables = true;
    return jsonResponse(request, {
      ok: true,
      checks,
      error_code: null,
      server_time: new Date().toISOString(),
    });
  } catch (error) {
    const cloudError = toCloudSyncError(error);
    console.error("[Cyber Zdrowie Sync Debug]", {
      action: "health",
      error_code: cloudError.errorCode,
      message: cloudError.message,
      stack: cloudError.stack || "-",
      entries_count: 0,
      dishes_count: 0,
    });
    return jsonResponse(request, {
      ok: false,
      checks,
      error_code: cloudError.errorCode,
      server_time: new Date().toISOString(),
    }, cloudError.status);
  }
}

Deno.serve(async (request) => {
  const serverTime = new Date().toISOString();
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(request) });
  }
  if (request.method !== "POST") {
    return jsonResponse(request, {
      ok: false,
      error: "Cloud sync failed",
      error_code: "invalid_payload",
      detail: "Method not allowed",
      server_time: serverTime,
    }, 405);
  }

  let action: SyncAction | "unknown" = "unknown";
  let entriesCount = 0;
  let dishesCount = 0;

  try {
    let body: SyncBody;
    try {
      body = await request.json() as SyncBody;
    } catch (error) {
      throw new CloudSyncError("invalid_payload", "Request body must be valid JSON", 400, error);
    }

    const requestedAction = String(body.action || "sync");
    entriesCount = Array.isArray(body.entries) ? body.entries.length : 0;
    dishesCount = Array.isArray(body.dishes) ? body.dishes.length : 0;

    if (!allowedActions.has(requestedAction as SyncAction)) {
      throw new CloudSyncError("invalid_payload", "Invalid action", 400);
    }
    action = requestedAction as SyncAction;

    const env = readEnvState();
    if (action === "health") {
      return await handleHealth(request, env, serverTime);
    }
    assertRequiredEnv(env);

    const syncCode = normalizeSyncCode(body.sync_code);
    if (!syncCode) {
      throw new CloudSyncError("invalid_payload", "sync_code is required", 400);
    }

    const codeHash = await sha256Hex(`${env.pepper}:${syncCode}`);
    const supabase = createClient(env.supabaseUrl, env.serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const syncSpaceId = await ensureSyncSpace(supabase, codeHash);
    const deviceId = sanitizeDeviceId(body.device_id);

    if (action === "push" || action === "sync") {
      const entries = readPayloadArray(body.entries, "entries");
      const dishes = readPayloadArray(body.dishes, "dishes");
      await upsertRows(supabase, "sync_entries", toEntryRows(syncSpaceId, entries, deviceId, serverTime), "upsert_entries_failed");
      await upsertRows(supabase, "sync_dishes", toDishRows(syncSpaceId, dishes, deviceId, serverTime), "upsert_dishes_failed");
    }

    const shouldPull = action === "pull" || action === "sync";
    const entries = shouldPull
      ? await pullPayloads(supabase, "sync_entries", syncSpaceId, body.since)
      : [];
    const dishes = shouldPull
      ? await pullPayloads(supabase, "sync_dishes", syncSpaceId, body.since)
      : [];

    return jsonResponse(request, {
      ok: true,
      sync_space_id: syncSpaceId,
      entries,
      dishes,
      server_time: new Date().toISOString(),
    });
  } catch (error) {
    const cloudError = toCloudSyncError(error);
    console.error("[Cyber Zdrowie Sync Debug]", {
      action,
      error_code: cloudError.errorCode,
      message: cloudError.message,
      stack: cloudError.stack || "-",
      entries_count: entriesCount,
      dishes_count: dishesCount,
    });
    return jsonResponse(request, {
      ok: false,
      error: "Cloud sync failed",
      error_code: cloudError.errorCode,
      detail: cloudError.detail,
      server_time: new Date().toISOString(),
    }, cloudError.status);
  }
});
