"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparkleIcon, HeartIcon } from "./Icons";

// Target Unlock Moment: May 10, 2027 00:00:00 IST (UTC+05:30)
const TARGET_TIMESTAMP = new Date("2027-05-10T00:00:00+05:30").getTime();

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

const PLAYFUL_TOASTS = [
  "🚨 BEEP BEEP! Sneak-peek alarm triggered! Nice try, bestie! 😜",
  "🎂 Shhh! The cake is still in the oven! Come back on May 10, 2027!",
  "🔒 Strict Security: Even birthday magic cannot bend time this early! ✨",
  "🌸 Patience, my friend! The best things in life are worth waiting for.",
  "🤫 Stop trying to peek! No spoilers until the big day! 🎁",
];

export const TimeGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<"checking" | "too_soon" | "unlocked">("checking");
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 0,
  });
  const [padlockShake, setPadlockShake] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [secretPasscode, setSecretPasscode] = useState("");
  const [secretError, setSecretError] = useState(false);
  const [verifiedTimeSource, setVerifiedTimeSource] = useState<string>("");

  const clockOffsetRef = useRef<number>(0);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculateRemaining = useCallback((nowTimestamp: number): TimeRemaining => {
    const totalMs = TARGET_TIMESTAMP - nowTimestamp;
    if (totalMs <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
    }
    const totalSeconds = Math.floor(totalMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, totalMs };
  }, []);

  useEffect(() => {
    // Check developer preview query param or session storage
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("preview") === "true" || sessionStorage.getItem("birthday_preview") === "true") {
        setStatus("unlocked");
        return;
      }
    }

    let isMounted = true;

    // Fetch verified time using free Time API with fast fallbacks
    const verifyTime = async () => {
      let verifiedNow: number | null = null;
      let sourceName = "";

      // 1. Primary: Free Time API (timeapi.io)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch("https://timeapi.io/api/time/current/zone?timeZone=UTC", {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.dateTime) {
            // dateTime string in UTC
            const parsed = new Date(data.dateTime + "Z").getTime();
            if (!isNaN(parsed)) {
              verifiedNow = parsed;
              sourceName = "Global Time Network (timeapi.io)";
            }
          }
        }
      } catch {
        // Network timeout or CORS fallback
      }

      // 2. Secondary: Internal Server Time API (/api/time)
      if (!verifiedNow) {
        try {
          const res = await fetch("/api/time", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (data?.now) {
              verifiedNow = Number(data.now);
              sourceName = "Cloud Server Time Sync";
            }
          }
        } catch {
          // Fallback to client clock
        }
      }

      // 3. Fallback: Browser local time
      if (!verifiedNow) {
        verifiedNow = Date.now();
        sourceName = "Device Clock";
      }

      if (!isMounted) return;

      setVerifiedTimeSource(sourceName);

      // Record offset between verified real-world time and local monotonic clock
      clockOffsetRef.current = verifiedNow - performance.now();

      const remaining = calculateRemaining(verifiedNow);
      setTimeRemaining(remaining);

      if (remaining.totalMs <= 0) {
        setStatus("unlocked");
      } else {
        setStatus("too_soon");
      }
    };

    verifyTime();

    // 1-second interval to update real-time countdown smoothly
    const interval = setInterval(() => {
      const currentRealTime = performance.now() + clockOffsetRef.current;
      const remaining = calculateRemaining(currentRealTime);
      setTimeRemaining(remaining);

      if (remaining.totalMs <= 0) {
        setStatus("unlocked");
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [calculateRemaining]);

  const handleRattleLock = () => {
    setPadlockShake(true);
    setTimeout(() => setPadlockShake(false), 600);

    const randomToast = PLAYFUL_TOASTS[Math.floor(Math.random() * PLAYFUL_TOASTS.length)];
    setToastMessage(randomToast);

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = secretPasscode.trim().toLowerCase();
    if (clean === "rishabh" || clean === "preview" || clean === "2027" || clean === "bestie") {
      sessionStorage.setItem("birthday_preview", "true");
      setShowSecretModal(false);
      setStatus("unlocked");
    } else {
      setSecretError(true);
      setTimeout(() => setSecretError(false), 2000);
    }
  };

  // 1. Initial Checking / Loading State
  if (status === "checking") {
    return (
      <div className="min-h-screen w-full bg-[#FFF5F7] flex flex-col items-center justify-center p-6 text-center select-none">
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-400 to-pink-300 flex items-center justify-center shadow-lg shadow-rose-200/60 mb-6 text-white"
        >
          <SparkleIcon className="w-8 h-8 animate-pulse text-white" />
        </motion.div>
        <h2 className="font-serif text-2xl font-semibold text-rose-950">
          Synchronizing with the stars...
        </h2>
        <p className="text-rose-700/70 text-sm mt-2 font-sans tracking-wide">
          Verifying celebration date & time...
        </p>
      </div>
    );
  }

  // 2. Unlocked State: Render normal birthday experience
  if (status === "unlocked") {
    return <>{children}</>;
  }

  // 3. Locked / Too Soon State
  return (
    <div className="relative min-h-screen w-full bg-[#FFF5F7] text-[#4C0519] flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl" />
      </div>

      {/* Floating subtle hearts */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-400"
            style={{
              top: `${15 + i * 14}%`,
              left: `${8 + (i * 17) % 84}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              rotate: [-12, 12, -12],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <HeartIcon className="w-6 h-6" />
          </motion.div>
        ))}
      </div>

      {/* Main Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-xl my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/80 backdrop-blur-2xl border border-rose-200/80 rounded-3xl p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(244,63,94,0.18)] text-center relative overflow-hidden"
        >
          {/* Subtle Top Rose Glow Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-300 via-rose-400 to-amber-200" />

          {/* Interactive Padlock Icon with Shaking Animation */}
          <div className="flex justify-center mb-5">
            <motion.div
              animate={
                padlockShake
                  ? {
                      rotate: [0, -14, 14, -12, 12, -6, 6, 0],
                      scale: [1, 1.15, 1.1, 1.05, 1],
                    }
                  : { y: [0, -4, 0] }
              }
              transition={
                padlockShake
                  ? { duration: 0.6 }
                  : { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }
              onClick={handleRattleLock}
              className="relative cursor-pointer group"
              title="Click to check if it opens!"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 flex items-center justify-center shadow-xl shadow-rose-300/60 group-hover:shadow-rose-400/80 transition-shadow">
                {/* Padlock SVG */}
                <svg
                  className="w-10 h-10 text-white fill-none stroke-current"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              {/* Sparkle badge */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2 w-7 h-7 bg-amber-300 rounded-full flex items-center justify-center text-amber-900 shadow-md"
              >
                <SparkleIcon className="w-4 h-4" />
              </motion.div>
            </motion.div>
          </div>

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-rose-100/90 text-rose-700 border border-rose-200 mb-3">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Time-Locked Surprise
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-rose-950 tracking-tight leading-tight">
            Shhh... <span className="italic text-rose-600">It's Too Soon!</span> 🤫
          </h1>

          {/* Sweet Subtitle */}
          <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Hold on there! Someone is trying to peek a little too early. This personalized celebration is locked tight with love and will unlock on:
          </p>

          <div className="mt-3 inline-block font-serif text-lg sm:text-xl font-bold text-rose-800 bg-rose-50/80 px-4 py-1.5 rounded-xl border border-rose-200/60 shadow-sm">
            ✨ May 10, 2027 ✨
          </div>

          {/* Real-time Countdown Grid */}
          <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { label: "DAYS", val: timeRemaining.days },
              { label: "HOURS", val: timeRemaining.hours },
              { label: "MINS", val: timeRemaining.minutes },
              { label: "SECS", val: timeRemaining.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-b from-white to-rose-50/60 rounded-2xl p-2 sm:p-3.5 border border-rose-200/70 shadow-sm flex flex-col items-center justify-center"
              >
                <span className="font-serif text-2xl sm:text-3xl font-extrabold text-rose-900 tabular-nums">
                  {String(item.val).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-rose-600/80 tracking-wider mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Interactive Playful Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRattleLock}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium text-sm shadow-md shadow-rose-300/40 hover:shadow-rose-400/60 transition-all flex items-center justify-center gap-2"
            >
              <span>Try to Sneak a Peek 👀</span>
            </motion.button>
          </div>

          {/* Interactive Floating Toast */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mt-5 p-3 rounded-2xl bg-rose-950 text-rose-100 text-xs sm:text-sm font-medium shadow-xl border border-rose-700/50 flex items-center justify-center gap-2"
              >
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Verified Time API Source Note */}
          {verifiedTimeSource && (
            <div className="mt-6 pt-4 border-t border-rose-100/80 flex items-center justify-center gap-1.5 text-[11px] text-stone-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Verified via <span className="font-semibold text-rose-700">{verifiedTimeSource}</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Discrete Bottom Creator Link */}
      <footer className="relative z-10 py-3 text-center">
        <button
          onClick={() => setShowSecretModal(true)}
          className="text-xs text-rose-600/70 hover:text-rose-800 transition-colors underline-offset-2 hover:underline cursor-pointer"
        >
          Creator / Developer Preview 🔑
        </button>
      </footer>

      {/* Passcode Modal for Creator / Rishabh */}
      <AnimatePresence>
        {showSecretModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-rose-200 text-center relative"
            >
              <button
                onClick={() => setShowSecretModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-lg w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100"
              >
                ✕
              </button>

              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <SparkleIcon className="w-6 h-6" />
              </div>

              <h3 className="font-serif text-xl font-bold text-rose-950">
                Creator Passcode
              </h3>
              <p className="text-xs text-stone-500 mt-1 mb-5">
                Enter your creator secret key to preview the full birthday website ahead of time.
              </p>

              <form onSubmit={handleSecretSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Passcode (e.g. 2027 or rishabh)"
                  value={secretPasscode}
                  onChange={(e) => setSecretPasscode(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-center text-sm font-medium"
                />

                {secretError && (
                  <p className="text-xs text-red-500 font-medium">
                    Incorrect passcode! Hint: 2027 or rishabh
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm transition-colors shadow-md shadow-rose-200"
                >
                  Unlock Preview
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
