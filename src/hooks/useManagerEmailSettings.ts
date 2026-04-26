const STORAGE_KEY = "manager_email_settings";

export interface ManagerEmailSettings {
  email: string;
  sendOnUrgent: boolean;
  sendOnNormal: boolean;
}

const defaults: ManagerEmailSettings = {
  email: "",
  sendOnUrgent: true,
  sendOnNormal: false,
};

export function loadManagerEmailSettings(): ManagerEmailSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export function saveManagerEmailSettings(settings: ManagerEmailSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
