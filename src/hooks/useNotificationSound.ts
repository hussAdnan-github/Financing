import { useCallback, useRef } from "react";
import { loadSoundSettings } from "@/hooks/useNotificationSoundSettings";

/**
 * Plays notification sounds using Web Audio API — no external files needed.
 * Respects user preferences from useNotificationSoundSettings.
 * Two sounds:
 *  - "soft"   → gentle two-tone chime (normal notifications)
 *  - "urgent" → sharp triple-beep (urgent / manager approval requests)
 */
export function useNotificationSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    try {
      if (!ctxRef.current || ctxRef.current.state === "closed") {
        ctxRef.current = new AudioContext();
      }
      return ctxRef.current;
    } catch {
      return null;
    }
  }, []);

  /** Play a single tone with volume scaling */
  const playTone = useCallback(
    (
      ctx: AudioContext,
      frequency: number,
      startTime: number,
      duration: number,
      volume: number,
      type: string = "sine",
      volumeScale: number = 1
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, startTime);

      const scaledVol = volume * volumeScale;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(scaledVol, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration);
    },
    []
  );

  /** Soft two-tone chime — for normal notifications */
  const playSoft = useCallback((volumeScale = 1) => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    playTone(ctx, 880, now, 0.25, 0.18, "sine", volumeScale);        // A5
    playTone(ctx, 1108, now + 0.15, 0.3, 0.14, "sine", volumeScale); // C#6
  }, [getCtx, playTone]);

  /** Urgent triple-beep — for urgent / manager approval requests */
  const playUrgent = useCallback((volumeScale = 1) => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    playTone(ctx, 1000, now, 0.12, 0.22, "square", volumeScale);
    playTone(ctx, 1100, now + 0.18, 0.12, 0.22, "square", volumeScale);
    playTone(ctx, 1200, now + 0.36, 0.18, 0.25, "square", volumeScale);
  }, [getCtx, playTone]);

  /** Auto-select sound based on urgency — respects user settings */
  const play = useCallback(
    (urgency: "normal" | "urgent" = "normal") => {
      const settings = loadSoundSettings();
      if (!settings.enabled) return;
      const vol = settings.volume;
      if (urgency === "urgent") {
        if (settings.urgentEnabled) playUrgent(vol);
      } else {
        if (settings.normalEnabled) playSoft(vol);
      }
    },
    [playSoft, playUrgent]
  );

  /** Preview play — ignores enabled flag, used for settings test button */
  const preview = useCallback(
    (urgency: "normal" | "urgent" = "normal") => {
      const settings = loadSoundSettings();
      const vol = settings.volume;
      if (urgency === "urgent") {
        playUrgent(vol);
      } else {
        playSoft(vol);
      }
    },
    [playSoft, playUrgent]
  );

  return { play, playSoft, playUrgent, preview };
}
