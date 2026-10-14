"use client";
// A soft generated drone (Web Audio), off by default and started only by the visitor.
// Synthesised in the browser: no recordings, nothing to license.
import { useEffect, useRef, useState } from "react";

export function SoundToggle() {
  const [on, setOn] = useState(false);
  const audio = useRef<{ ctx: AudioContext; gain: GainNode } | null>(null);

  useEffect(() => () => void audio.current?.ctx.close(), []);

  const toggle = () => {
    if (!audio.current) {
      const ctx = new AudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 600;
      filter.connect(gain).connect(ctx.destination);
      // A low fundamental with a fifth and a slowly beating octave.
      for (const [freq, level] of [
        [65.4, 0.5],
        [98.0, 0.25],
        [130.8, 0.18],
        [131.3, 0.18],
      ] as const) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        g.gain.value = level;
        osc.connect(g).connect(filter);
        osc.start();
      }
      audio.current = { ctx, gain };
    }
    const { ctx, gain } = audio.current;
    const next = !on;
    void ctx.resume();
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setTargetAtTime(next ? 0.08 : 0, ctx.currentTime, 0.8);
    setOn(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      className="rounded-full border border-white/20 px-3 py-1 text-xs text-ink/80 hover:text-ink"
    >
      {on ? "Sound on" : "Sound off"}
    </button>
  );
}
