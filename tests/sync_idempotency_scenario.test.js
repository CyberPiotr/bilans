const assert = require("assert/strict");

function readStableEntryId(entry) {
  return String(entry?.sync_id || entry?.client_entry_id || entry?.local_id || entry?.id || "").trim();
}

function withStableEntry(entry) {
  const stableId = readStableEntryId(entry);
  if (!stableId) throw new Error("Entry is missing a stable id");
  return {
    ...entry,
    id: stableId,
    sync_id: stableId,
    client_entry_id: stableId,
  };
}

function mergeEntries(localEntries, cloudEntries) {
  const merged = new Map(localEntries.map((entry) => [readStableEntryId(entry), withStableEntry(entry)]));
  const seenRemoteIds = new Set();
  let pulledNew = 0;
  let skippedExisting = 0;
  let skippedDuplicates = 0;

  cloudEntries.forEach((cloudEntry) => {
    const normalized = withStableEntry(cloudEntry);
    const stableId = readStableEntryId(normalized);
    if (seenRemoteIds.has(stableId)) {
      skippedDuplicates += 1;
      return;
    }
    seenRemoteIds.add(stableId);
    if (merged.has(stableId)) {
      skippedExisting += 1;
      return;
    }
    merged.set(stableId, normalized);
    pulledNew += 1;
  });

  return {
    entries: [...merged.values()],
    stats: { pulledNew, skippedExisting, skippedDuplicates },
  };
}

function pushEntries(cloudEntries, localEntries) {
  const cloud = new Map(cloudEntries.map((entry) => [readStableEntryId(entry), withStableEntry(entry)]));
  let pushedNew = 0;
  let pushedUpdated = 0;

  localEntries.forEach((entry) => {
    const normalized = withStableEntry(entry);
    const stableId = readStableEntryId(normalized);
    if (cloud.has(stableId)) {
      pushedUpdated += 1;
    } else {
      pushedNew += 1;
    }
    cloud.set(stableId, normalized);
  });

  return {
    entries: [...cloud.values()],
    stats: { pushedNew, pushedUpdated },
  };
}

function syncDevice(deviceEntries, cloudEntries) {
  const pushed = pushEntries(cloudEntries, deviceEntries);
  const pulled = mergeEntries(deviceEntries, pushed.entries);
  return {
    deviceEntries: pulled.entries,
    cloudEntries: pushed.entries,
    stats: { ...pushed.stats, ...pulled.stats },
  };
}

function makeEntry(id, kcal) {
  return {
    id,
    sync_id: id,
    client_entry_id: id,
    date: "2026-07-06",
    createdAt: `2026-07-06T10:${id === "entry-a" ? "00" : "05"}:00.000Z`,
    rawText: `${kcal} kcal`,
    parsedData: { calories: kcal, protein: 0, fat: 0, carbs: 0 },
    tags: [],
    products: [],
  };
}

function totalCalories(entries) {
  return entries.reduce((sum, entry) => sum + Number(entry.parsedData?.calories || 0), 0);
}

function assertDeviceState(label, entries) {
  assert.equal(entries.length, 2, `${label} should have exactly two entries`);
  assert.equal(new Set(entries.map(readStableEntryId)).size, 2, `${label} should have two unique stable ids`);
  assert.equal(totalCalories(entries), 2000, `${label} should have 2000 kcal after repeated sync`);
}

let cloud = [];
let deviceA = [makeEntry("entry-a", 500)];
let deviceB = [];

({ deviceEntries: deviceA, cloudEntries: cloud } = syncDevice(deviceA, cloud));
({ deviceEntries: deviceB, cloudEntries: cloud } = syncDevice(deviceB, cloud));

deviceB.push(makeEntry("entry-b", 1500));
({ deviceEntries: deviceB, cloudEntries: cloud } = syncDevice(deviceB, cloud));
({ deviceEntries: deviceA, cloudEntries: cloud } = syncDevice(deviceA, cloud));
({ deviceEntries: deviceA, cloudEntries: cloud } = syncDevice(deviceA, cloud));
({ deviceEntries: deviceB, cloudEntries: cloud } = syncDevice(deviceB, cloud));

assertDeviceState("Device A", deviceA);
assertDeviceState("Device B", deviceB);
assert.equal(cloud.length, 2, "Cloud should keep exactly two stable entries");
assert.equal(totalCalories(cloud), 2000, "Cloud should keep 2000 kcal");

console.log("sync idempotency scenario: OK");
