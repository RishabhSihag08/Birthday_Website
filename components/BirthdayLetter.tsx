"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SparkleIcon,
  WaxSealIcon,
  ReplayIcon,
  FloralVineIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  FeatherQuillIcon,
  CakeEmblemIcon,
} from "./Icons";

interface BirthdayLetterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BirthdayLetter: React.FC<BirthdayLetterProps> = ({
  isOpen,
  onClose,
}) => {
  const [isSealBroken, setIsSealBroken] = useState(false);
  const [activeTab, setActiveTab] = useState<"letter" | "pacts">("letter");

  const letterLines = [
    "To my absolute best friend in the world,",
    "Another year older, wiser, and still the most delightfully wonderful and inspiring human being I have the honor of knowing.",
    "Looking back at everything we've shared—the random late-night calls, laughing until our stomachs hurt over inside jokes nobody else gets, and lifting each other up through the toughest weeks—I honestly can't imagine this journey of life without you.",
    "You are the friend who shows up without hesitation, who listens with zero judgment, and who celebrates every small win like it's a world championship. Your loyalty, kindness, and chaotic radiant energy make the world ten times brighter.",
    "As you blow out your candles this year, I hope you realize how deeply loved, appreciated, and irreplaceable you are. May this new chapter bring you endless adventures, quiet peace of mind, and every big dream you are working toward.",
    "Thank you for being my constant anchor, my confidant, and my favorite person to conquer life with.",
    "Happy Birthday, Bestie! Always in your corner,",
  ];

  const bestFriendPacts = [
    {
      title: "The 2 AM Lifeline",
      desc: "No matter the time, time zone, or circumstance, my phone is always on for you to vent, celebrate, or share a midnight breakdown.",
    },
    {
      title: "Chief Hype Specialist",
      desc: "To be your loudest cheerleader in every career leap, creative pursuit, and personal milestone you chase.",
    },
    {
      title: "Unfiltered Honesty & Loyalty",
      desc: "To tell you the honest truth with total love, and back you up unconditionally against whatever life throws your way.",
    },
    {
      title: "Lifelong Silliness",
      desc: "To never let growing up stop us from making silly jokes, having spontaneous road trips, and ordering too much food together.",
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="letter-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#FFF5F7]/95 backdrop-blur-xl overflow-y-auto"
      >
        <div className="relative w-full max-w-2xl my-auto py-6">
          {!isSealBroken ? (
            /* ENVELOPE STAGE */
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto max-w-lg glass-panel rounded-3xl p-8 md:p-12 text-center shadow-2xl border border-rose-200/70"
            >
              {/* Floating ambient corner sparkles */}
              <div className="absolute top-4 left-4 text-rose-300">
                <SparkleIcon className="w-5 h-5 animate-pulse" />
              </div>
              <div className="absolute top-4 right-4 text-rose-300">
                <SparkleIcon className="w-5 h-5 animate-pulse" />
              </div>

              <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-6 shadow-inner">
                <EnvelopeIcon className="w-8 h-8" />
              </div>

              <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#881337]/70 font-semibold mb-2">
                A Letter For My Best Friend
              </span>

              <h2 className="font-editorial text-3xl md:text-4xl text-[#4C0519] font-normal mb-3">
                Written From The Heart
              </h2>

              <p className="font-sans text-sm md:text-base text-[#881337]/75 max-w-sm mx-auto mb-8 leading-relaxed">
                A handwritten birthday letter celebrating our friendship. Tap the wax seal to break it open.
              </p>

              {/* Wax Seal Button */}
              <div className="relative inline-flex flex-col items-center group">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsSealBroken(true)}
                  className="wax-seal w-24 h-24 rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-rose-300/50"
                  aria-label="Open Handwritten Birthday Letter"
                >
                  <WaxSealIcon className="w-16 h-16 text-rose-900 drop-shadow" />
                </motion.button>

                <div className="mt-4 flex items-center space-x-1.5 text-xs font-semibold tracking-wider text-rose-600 uppercase">
                  <span>Break Wax Seal</span>
                  <SparkleIcon className="w-3.5 h-3.5 text-rose-500" />
                </div>
              </div>
            </motion.div>
          ) : (
            /* OPENED LETTER STAGE */
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="parchment-card rounded-3xl p-6 md:p-12 shadow-2xl relative border border-rose-300/40 text-[#4C0519]"
            >
              {/* Top Bar with navigation */}
              <div className="flex items-center justify-between pb-6 border-b border-rose-200/60 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100/80 flex items-center justify-center text-rose-600">
                    <EnvelopeOpenIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-[#881337]/70 font-semibold">
                      To My Favorite Person
                    </span>
                    <span className="text-xs text-rose-500/80">Best Friends Forever</span>
                  </div>
                </div>

                {/* Tabs: The Letter vs Best Friend Pacts */}
                <div className="flex items-center bg-rose-100/60 p-1 rounded-full border border-rose-200/50">
                  <button
                    onClick={() => setActiveTab("letter")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      activeTab === "letter"
                        ? "bg-white text-rose-700 shadow-sm"
                        : "text-[#881337]/70 hover:text-rose-700"
                    }`}
                  >
                    The Letter
                  </button>
                  <button
                    onClick={() => setActiveTab("pacts")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      activeTab === "pacts"
                        ? "bg-white text-rose-700 shadow-sm"
                        : "text-[#881337]/70 hover:text-rose-700"
                    }`}
                  >
                    Friendship Pacts
                  </button>
                </div>
              </div>

              {/* Decorative Floral Top Flourish */}
              <div className="flex justify-center text-rose-400 mb-4 opacity-75">
                <FloralVineIcon className="w-36 h-6" />
              </div>

              {/* Tab 1: The Heartfelt Best Friend Letter */}
              {activeTab === "letter" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4 md:space-y-5"
                >
                  <h3 className="font-editorial text-2xl md:text-3xl font-medium text-[#4C0519] italic tracking-wide">
                    {letterLines[0]}
                  </h3>

                  {letterLines.slice(1, -1).map((line, idx) => (
                    <motion.p
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + idx * 0.08, duration: 0.6 }}
                      className="font-editorial text-base md:text-lg text-[#881337]/85 leading-relaxed font-normal"
                    >
                      {line}
                    </motion.p>
                  ))}

                  <div className="pt-6 border-t border-rose-200/50 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <p className="font-editorial text-base text-[#881337]/80 italic">
                        {letterLines[letterLines.length - 1]}
                      </p>
                      <p className="font-editorial text-2xl font-semibold text-[#4C0519] mt-1 tracking-wider">
                        Rishabh
                      </p>
                    </div>

                    <div className="inline-flex items-center space-x-2 text-rose-600 text-xs font-semibold uppercase tracking-wider bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200/50">
                      <FeatherQuillIcon className="w-3.5 h-3.5" />
                      <span>Handwritten with Love</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 2: Best Friend Pacts */}
              {activeTab === "pacts" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <h3 className="font-editorial text-2xl md:text-3xl text-[#4C0519] font-medium">
                      Our Best Friend Pacts
                    </h3>
                    <p className="text-xs text-[#881337]/70 mt-1">
                      Non-negotiable promises for our friendship, today and always.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bestFriendPacts.map((pact, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className="bg-white/80 p-4 rounded-2xl border border-rose-200/60 shadow-sm"
                      >
                        <div className="flex items-center space-x-2 text-rose-600 mb-1.5">
                          <SparkleIcon className="w-3.5 h-3.5 text-rose-500" />
                          <h4 className="font-editorial text-lg font-semibold text-[#4C0519]">
                            {pact.title}
                          </h4>
                        </div>
                        <p className="text-xs md:text-sm text-[#881337]/80 leading-relaxed font-sans">
                          {pact.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Bottom Actions */}
              <div className="mt-8 pt-6 border-t border-rose-200/60 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={onClose}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white hover:bg-rose-50 border border-rose-300/60 text-xs md:text-sm font-medium text-rose-700 transition shadow-sm hover:shadow"
                >
                  <ReplayIcon className="w-4 h-4 text-rose-500" />
                  <span>Revisit Birthday Cake</span>
                </button>

                <button
                  onClick={() => setIsSealBroken(false)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs text-[#881337]/70 hover:text-rose-700 transition"
                >
                  <span>Re-seal Envelope</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
