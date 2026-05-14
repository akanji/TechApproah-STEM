export const storage = {
  get: <T,>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(`app_pref_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return defaultValue;
    }
  },
  set: <T,>(key: string, value: T): void => {
    try {
      localStorage.setItem(`app_pref_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing localStorage key "${key}":`, e);
    }
  }
};
