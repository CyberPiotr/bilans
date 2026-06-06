(() => {
  "use strict";

  const DB_NAME = "keto_tracker_db";
  const DB_VERSION = 2;
  const ENTRIES_STORE = "entries";
  const SETTINGS_STORE = "settings";
  const SETTINGS_ID = "user-settings";

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(ENTRIES_STORE)) {
          const store = db.createObjectStore(ENTRIES_STORE, { keyPath: "id" });
          store.createIndex("date", "date", { unique: false });
          store.createIndex("createdAt", "createdAt", { unique: false });
        }
        if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
          db.createObjectStore(SETTINGS_STORE, { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error("Aktualizacja bazy jest zablokowana przez inną kartę."));
    });
  }

  async function runTransaction(storeName, mode, operation) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      let result;

      try {
        result = operation(store);
      } catch (error) {
        db.close();
        reject(error);
        return;
      }

      transaction.oncomplete = () => {
        db.close();
        resolve(result);
      };
      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
      transaction.onabort = () => {
        db.close();
        reject(transaction.error || new Error("Transakcja została przerwana."));
      };
    });
  }

  async function saveEntry(entry) {
    return runTransaction(ENTRIES_STORE, "readwrite", (store) => store.put(entry));
  }

  async function deleteEntry(id) {
    return runTransaction(ENTRIES_STORE, "readwrite", (store) => store.delete(id));
  }

  async function getAllEntries() {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(ENTRIES_STORE, "readonly");
      const request = transaction.objectStore(ENTRIES_STORE).getAll();

      request.onsuccess = () => {
        db.close();
        resolve(request.result);
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  }

  async function importEntries(entries) {
    const existing = await getAllEntries();
    const existingIds = new Set(existing.map((entry) => entry.id));
    const uniqueEntries = entries.filter((entry) => {
      if (!entry.id || existingIds.has(entry.id)) {
        return false;
      }
      existingIds.add(entry.id);
      return true;
    });

    if (uniqueEntries.length === 0) {
      return 0;
    }

    await runTransaction(ENTRIES_STORE, "readwrite", (store) => {
      uniqueEntries.forEach((entry) => store.add(entry));
    });

    return uniqueEntries.length;
  }

  async function getSettings() {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SETTINGS_STORE, "readonly");
      const request = transaction.objectStore(SETTINGS_STORE).get(SETTINGS_ID);

      request.onsuccess = () => {
        db.close();
        resolve(request.result?.value || null);
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  }

  async function saveSettings(settings) {
    return runTransaction(SETTINGS_STORE, "readwrite", (store) => store.put({
      id: SETTINGS_ID,
      value: settings,
      updatedAt: new Date().toISOString(),
    }));
  }

  window.ketoDb = {
    deleteEntry,
    getAllEntries,
    getSettings,
    importEntries,
    saveEntry,
    saveSettings,
  };
})();
