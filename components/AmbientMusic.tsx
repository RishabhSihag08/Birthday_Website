"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { SoundOnIcon, SoundOffIcon } from "./Icons";

export const AmbientMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isStartedRef = useRef<boolean>(false);

  // Uplifting, warm music box pentatonic progression celebrating friendship (C4, D4, E4, G4, A4, C5, D5, E5)
  const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];

  const playPluck = useCallback((freq: number) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Warm, gentle acoustic bell chime envelope
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.85);
  }, []);

  const startMelodyLoop = useCallback(() => {
    if (isStartedRef.current && intervalRef.current) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume().catch(() => {});
      }

      let step = 0;
      // Joyful, heartwarming friendship melody loop
      const melodySequence = [0, 2, 4, 7, 5, 4, 2, 3, 0, 4, 6, 7, 4, 2, 1, 0];

      // Play first note immediately
      playPluck(notes[melodySequence[0] % notes.length]);

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        step = (step + 1) % melodySequence.length;
        const noteIndex = melodySequence[step] % notes.length;
        playPluck(notes[noteIndex]);
      }, 650);

      isStartedRef.current = true;
      setIsPlaying(true);
    } catch {
      // Audio not permitted in this context
    }
  }, [notes, playPluck]);

  const stopMelody = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isStartedRef.current = false;
    setIsPlaying(false);
  }, []);

  // Always auto-play on page mount & resume on first user interaction (scroll, click, touch)
  useEffect(() => {
    // Attempt immediate start
    startMelodyLoop();

    // Browser autoplay policy handler: resume on any initial interaction
    const unlockAudio = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume().then(() => {
          if (!isStartedRef.current) {
            startMelodyLoop();
          }
        }).catch(() => {});
      } else if (!isStartedRef.current) {
        startMelodyLoop();
      }
    };

    window.addEventListener("click", unlockAudio, { once: false, passive: true });
    window.addEventListener("scroll", unlockAudio, { once: false, passive: true });
    window.addEventListener("touchstart", unlockAudio, { once: false, passive: true });
    window.addEventListener("keydown", unlockAudio, { once: false, passive: true });

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("scroll", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [startMelodyLoop]);

  const toggleSound = () => {
    if (isPlaying) {
      stopMelody();
    } else {
      startMelodyLoop();
    }
  };

  return (
    <button
      onClick={toggleSound}
      aria-label={isPlaying ? "Mute birthday melody" : "Play birthday melody"}
      className="glass-pill fixed top-5 right-5 z-40 px-3.5 py-2 rounded-full flex items-center space-x-2 text-rose-700 hover:text-rose-900 transition-all shadow-sm hover:shadow active:scale-95 text-xs font-medium cursor-pointer"
    >
      {isPlaying ? (
        <>
          <SoundOnIcon className="w-4 h-4 text-rose-600 animate-pulse" />
          <span className="hidden sm:inline">Melody Playing</span>
        </>
      ) : (
        <>
          <SoundOffIcon className="w-4 h-4 text-rose-400" />
          <span className="hidden sm:inline">Play Melody</span>
        </>
      )}
    </button>
  );
};
