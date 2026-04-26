/**
 * Persists notification sound preferences in localStorage.
 * Shared across the app — any component can read/write these settings.
 */

const STORAGE_KEY = "notif_sound_settings_v1";

export interface NotificationSoundSettings {
  enabled: boolean;           // master on/off
  urgentEnabled: boolean;     // play urgent sound for urgent notifications
  normalEnabled: boolean;     // play soft sound for normal notifications
  volume: number;             // 0.0 – 1.0
}

const DEFAULTS: NotificationSoundSettings = {
  enabled: true,
  urgentEnabled: true,
  normalEnabled: true,
  volume: 0.7,
};

export function loadSoundSettings(): NotificationSoundSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULTS, ...JSON.parse(raw) } as NotificationSoundSettings;
    }
  } catch { /* ignore */ }
  return { ...DEFAULTS };
}

export function saveSoundSettings(settings: NotificationSoundSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
