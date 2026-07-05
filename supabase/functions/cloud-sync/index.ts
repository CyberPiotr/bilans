import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type SyncAction = "setup" | "push" | "pull" | "sync";

type SyncBody = {
  action?: SyncAction;
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

const allowedActions = new Set<SyncAction>(["setup", "push", "pull", "sync"]);
const maxItemsPerRequest = 1000;

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

function asLimitedArray(value: unknown): SyncPayload[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is SyncPayload => Boolean(item) && typeof item === "object" && !Array.isArray(item))
    .slice(0, maxItemsPerRequest);
}

function readLocalId(item: SyncPayload): string | null {
  const value = typeof item.local_id === "string" ? item.local_id : item.id;
  const text = String(value || "").trim();
  return text || null;
}

function readPayloadTimestamp(item: SyncPayload, fallback: string): string {
  const value = typeof item.updatedAt === "string"
    ? item.updatedAt
    : typeof item.createdAt === "string" ? item.createdAt : "";
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : fallback;
}

function toEntryRows(syncSpaceId: string, entries: SyncPayload[], deviceId: string | null, now: string): SyncRow[] {
  return entries.flatMap((entry) => {
    const localId = readLocalId(entry);
    if (!localId) return [];
    return [{
      sync_space_id: syncSpaceId,
      local_id: localId,
      entry_date: typeof entry.date === "string" ? entry.date : null,
      payload: entry,
      source_device: deviceId,
      deleted_at: null,
      updated_at: readPayloadTimestamp(entry, now),
    }];
  });
}

function toDishRows(syncSpaceId: string, dishes: SyncPayload[], deviceId: string | null, now: string): SyncRow[] {
  return dishes.flatMap((dish) => {
    const localId = readLocalId(dish);
    if (!localId) return [];
    return [{
      sync_space_id: syncSpaceId,
      local_id: localId,
      payload: dish,
      source_device: deviceId,
      deleted_at: null,
      updated_at: readPayloadTimestamp(dish, now),
    }];
  });
}

async function ensureSyncSpace(supabase: ReturnType<typeof createClient>, codeHash: string): Promise<string> {
  const { data, error } = await supabase
    .from("sync_spaces")
    .upsert({ code_hash: codeHash, updated_at: new Date().toISOString() }, { onConflict: "code_hash" })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

async function upsertRows(
  supabase: ReturnType<typeof createClient>,
  table: "sync_entries" | "sync_dishes",
  rows: SyncRow[],
): Promise<void> {
  if (!rows.length) return;
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: "sync_space_id,local_id" });
  if (error) throw error;
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
  if (error) throw error;
  return (data || [])
    .map((row) => row.payload)
    .filter((payload): payload is SyncPayload => Boolean(payload) && typeof payload === "object" && !Array.isArray(payload));
}

Deno.serve(async (request) => {
  const serverTime = new Date().toISOString();
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(request) });
  }
  if (request.method !== "POST") {
    return jsonResponse(request, { ok: false, error: "Method not allowed", server_time: serverTime }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const pepper = Deno.env.get("SYNC_CODE_PEPPER");

    if (!supabaseUrl || !serviceRoleKey || !pepper) {
      return jsonResponse(request, { ok: false, error: "Cloud sync is not configured", server_time: serverTime }, 500);
    }

    const body = await request.json() as SyncBody;
    const action = body.action || "sync";
    if (!allowedActions.has(action)) {
      return jsonResponse(request, { ok: false, error: "Invalid action", server_time: serverTime }, 400);
    }

    const syncCode = normalizeSyncCode(body.sync_code);
    if (!syncCode) {
      return jsonResponse(request, { ok: false, error: "sync_code is required", server_time: serverTime }, 400);
    }

    const codeHash = await sha256Hex(`${pepper}:${syncCode}`);
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const syncSpaceId = await ensureSyncSpace(supabase, codeHash);
    const deviceId = sanitizeDeviceId(body.device_id);

    if (action === "push" || action === "sync") {
      const entries = asLimitedArray(body.entries);
      const dishes = asLimitedArray(body.dishes);
      await upsertRows(supabase, "sync_entries", toEntryRows(syncSpaceId, entries, deviceId, serverTime));
      await upsertRows(supabase, "sync_dishes", toDishRows(syncSpaceId, dishes, deviceId, serverTime));
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
    const message = error instanceof Error ? error.message : "Cloud sync failed";
    return jsonResponse(request, { ok: false, error: message, server_time: new Date().toISOString() }, 500);
  }
});
