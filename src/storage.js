/**
 * Small async wrapper around window.localStorage, mirroring the
 * get/set/delete/list shape used by the app. This runs entirely in
 * the visitor's browser — each device keeps its own history. If you
 * later add real accounts, swap this module for calls to your own
 * backend/database (e.g. Supabase) without touching the components.
 */

const NAMESPACE = "ykr_storage:";

function namespacedKey(key) {
  return NAMESPACE + key;
}

export const storage = {
  async get(key) {
    const raw = window.localStorage.getItem(namespacedKey(key));
    if (raw == null) return null;
    return { key, value: raw };
  },

  async set(key, value) {
    window.localStorage.setItem(namespacedKey(key), value);
    return { key, value };
  },

  async delete(key) {
    window.localStorage.removeItem(namespacedKey(key));
    return { key, deleted: true };
  },

  async list(prefix = "") {
    const keys = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const fullKey = window.localStorage.key(i);
      if (fullKey && fullKey.startsWith(NAMESPACE)) {
        const bareKey = fullKey.slice(NAMESPACE.length);
        if (!prefix || bareKey.startsWith(prefix)) keys.push(bareKey);
      }
    }
    return { keys };
  },
};
