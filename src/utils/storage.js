import { STORAGE_KEY } from "../constants/storage";

// Use Claude artifact storage if available, otherwise fall back to localStorage
const claudeStorage = typeof window !== "undefined" && window.storage;

export async function loadConfigs() {
  try {
    if (claudeStorage) {
      const res = await window.storage.get(STORAGE_KEY);
      return res ? JSON.parse(res.value) : [];
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveConfigs(configs) {
  try {
    const serialized = JSON.stringify(configs);
    if (claudeStorage) {
      await window.storage.set(STORAGE_KEY, serialized);
    } else {
      localStorage.setItem(STORAGE_KEY, serialized);
    }
  } catch (e) {
    console.error("Storage error:", e);
  }
}
