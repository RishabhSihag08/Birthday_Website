"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  SparkleIcon,
  HeartIcon,
  ScrollArrowIcon,
  FlameIcon,
  CakeEmblemIcon,
  FeatherQuillIcon,
} from "./Icons";
import { BirthdayLetter } from "./BirthdayLetter";

const TOTAL_FRAMES = 80;

export const BirthdayScroll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [showLetter, setShowLetter] = useState(false);
  const [isCakeClickable, setIsCakeClickable] = useState(false);
  const [isHoveringCake, setIsHoveringCake] = useState(false);

  // Scroll mapping with spring physics for zero-stutter interpolation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  // Narrative section opacity & motion transforms
  // 1. 0% - 18%: Hero Welcome (Best Friend Vibes)
  const heroOpacity = useTransform(smoothProgress, [0, 0.06, 0.15, 0.22], [1, 1, 0.75, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.22], [0, -35]);

  // 2. 25% - 45%: Cake Assembly (Left-aligned)
  const section2Opacity = useTransform(smoothProgress, [0.22, 0.28, 0.42, 0.48], [0, 1, 1, 0]);
  const section2X = useTransform(smoothProgress, [0.22, 0.28, 0.42, 0.48], [-40, 0, 0, -30]);

  // 3. 55% - 75%: Florals & Blooming (Right-aligned)
  const section3Opacity = useTransform(smoothProgress, [0.52, 0.58, 0.72, 0.78], [0, 1, 1, 0]);
  const section3X = useTransform(smoothProgress, [0.52, 0.58, 0.72, 0.78], [40, 0, 0, 30]);

  // 4. 85% - 100%: Candles Lit & Side-docked Handwritten Letter trigger
  const section4Opacity = useTransform(smoothProgress, [0.80, 0.86, 1], [0, 1, 1]);
  const section4X = useTransform(smoothProgress, [0.80, 0.86, 1], [30, 0, 0]);

  // Track when cake is clickable (progress >= 0.78)
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      setIsCakeClickable(latest >= 0.78);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Smart Preload Logic: Probe first frame before fetching sequence
  useEffect(() => {
    let isMounted = true;

    const probeAndLoad = async () => {
      const probeImg = new Image();
      const frame0Url = `/video-split/frame_0_delay-0.04s.webp`;

      const frame0Exists = await new Promise<boolean>((resolve) => {
        probeImg.onload = () => resolve(true);
        probeImg.onerror = () => {
          const altImg = new Image();
          altImg.onload = () => resolve(true);
          altImg.onerror = () => resolve(false);
          altImg.src = `/video-split/frame_00_delay-0.04s.webp`;
        };
        probeImg.src = frame0Url;
      });

      if (!isMounted) return;

      if (!frame0Exists) {
        // Activate procedural canvas cake engine cleanly
        setImages([]);
        setImagesLoaded(false);
        setLoadProgress(100);
        return;
      }

      let loadedCount = 1;
      setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));

      const batchPromises: Promise<HTMLImageElement | null>[] = [];
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        batchPromises.push(
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              loadedCount++;
              if (isMounted) {
                setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
              }
              resolve(img);
            };
            img.onerror = () => {
              const padImg = new Image();
              padImg.onload = () => {
                loadedCount++;
                if (isMounted) {
                  setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
                }
                resolve(padImg);
              };
              padImg.onerror = () => resolve(null);
              padImg.src = `/video-split/frame_${String(i).padStart(2, "0")}_delay-0.04s.webp`;
            };
            img.src = `/video-split/frame_${i}_delay-0.04s.webp`;
          })
        );
      }

      const remainingResults = await Promise.all(batchPromises);
      if (!isMounted) return;

      const validRest = remainingResults.filter((img): img is HTMLImageElement => img !== null);
      if (validRest.length >= 20) {
        setImages([probeImg, ...validRest]);
        setImagesLoaded(true);
      } else {
        setImagesLoaded(false);
      }
      setLoadProgress(100);
    };

    probeAndLoad();

    return () => {
      isMounted = false;
    };
  }, []);

  // Liquid Glass Morphing Cake Renderer
  // Tiers materialize from liquid glass pools that rise and solidify
  const drawProceduralCake = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      progress: number,
      time: number
    ) => {
      ctx.fillStyle = "#FFF5F7";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const baseCenterY = height * 0.5;
      const scaleFactor = Math.min(Math.max(width / 800, 0.65), Math.max(height / 700, 0.65), 1.15);

      // Ambient glow that pulses with the animation
      const glowIntensity = 0.12 + Math.sin(time * 0.001) * 0.03;
      const ambientGlow = ctx.createRadialGradient(
        centerX, baseCenterY, 50 * scaleFactor,
        centerX, baseCenterY, 400 * scaleFactor
      );
      ambientGlow.addColorStop(0, `rgba(251, 113, 133, ${glowIntensity})`);
      ambientGlow.addColorStop(0.5, `rgba(254, 205, 214, ${glowIntensity * 0.5})`);
      ambientGlow.addColorStop(1, "rgba(255, 245, 247, 0)");
      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.ellipse(centerX, baseCenterY, 380 * scaleFactor, 120 * scaleFactor, 0, 0, Math.PI * 2);
      ctx.fill();

      // Helper function to draw liquid morphing tier
      const drawLiquidTier = (
        yPos: number,
        radiusX: number,
        radiusY: number,
        height: number,
        morphProgress: number,
        hue: number
      ) => {
        if (morphProgress <= 0) return;

        ctx.save();

        // Liquid phase (0 - 0.4): rippling pool
        if (morphProgress < 0.4) {
          const liquidPhase = morphProgress / 0.4;
          const ripples = 6;
          const waveAmplitude = (8 * (1 - liquidPhase)) * scaleFactor;

          ctx.globalAlpha = 0.6 + liquidPhase * 0.4;

          // Draw liquid pool with ripples
          const liquidGrad = ctx.createRadialGradient(
            centerX, yPos, 10 * scaleFactor,
            centerX, yPos, radiusX * liquidPhase
          );
          liquidGrad.addColorStop(0, `hsla(${hue}, 85%, 75%, 0.9)`);
          liquidGrad.addColorStop(0.5, `hsla(${hue}, 75%, 85%, 0.7)`);
          liquidGrad.addColorStop(1, `hsla(${hue}, 65%, 95%, 0.3)`);

          ctx.fillStyle = liquidGrad;
          ctx.beginPath();
          for (let i = 0; i <= 360; i += 3) {
            const angle = (i * Math.PI) / 180;
            const wave = Math.sin(i * ripples + time * 0.003) * waveAmplitude;
            const r = (radiusX * liquidPhase) + wave;
            const x = centerX + Math.cos(angle) * r;
            const y = yPos + Math.sin(angle) * (radiusY * liquidPhase * 0.3) + wave * 0.3;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();

          // Liquid shine
          ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * liquidPhase})`;
          ctx.beginPath();
          ctx.ellipse(centerX - 20 * scaleFactor, yPos - 5 * scaleFactor,
            radiusX * liquidPhase * 0.4, radiusY * liquidPhase * 0.2, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Rising phase (0.4 - 0.7): liquid rises into shape
        else if (morphProgress < 0.7) {
          const risePhase = (morphProgress - 0.4) / 0.3;
          const currentHeight = height * risePhase;
          const wobble = Math.sin(time * 0.004) * 3 * (1 - risePhase) * scaleFactor;

          ctx.globalAlpha = 0.7 + risePhase * 0.3;

          // Rising liquid cylinder with wobble
          const risingGrad = ctx.createLinearGradient(
            centerX - radiusX, yPos - currentHeight,
            centerX + radiusX, yPos
          );
          risingGrad.addColorStop(0, `hsla(${hue}, 80%, 70%, 0.95)`);
          risingGrad.addColorStop(0.3, `hsla(${hue}, 75%, 85%, 0.9)`);
          risingGrad.addColorStop(0.7, `hsla(${hue}, 70%, 92%, 0.85)`);
          risingGrad.addColorStop(1, `hsla(${hue}, 75%, 80%, 0.9)`);

          ctx.fillStyle = risingGrad;
          ctx.beginPath();
          ctx.moveTo(centerX - radiusX + wobble, yPos);
          ctx.lineTo(centerX - radiusX - wobble, yPos - currentHeight);
          ctx.ellipse(centerX, yPos - currentHeight, radiusX, radiusY, 0, Math.PI, 0, true);
          ctx.lineTo(centerX + radiusX + wobble, yPos);
          ctx.ellipse(centerX, yPos, radiusX, radiusY, 0, 0, Math.PI, false);
          ctx.fill();

          // Liquid top surface
          const topGrad = ctx.createRadialGradient(
            centerX - 30 * scaleFactor, yPos - currentHeight - 10 * scaleFactor, 5 * scaleFactor,
            centerX, yPos - currentHeight, radiusX
          );
          topGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
          topGrad.addColorStop(0.5, `hsla(${hue}, 70%, 95%, 0.8)`);
          topGrad.addColorStop(1, `hsla(${hue}, 75%, 85%, 0.9)`);

          ctx.fillStyle = topGrad;
          ctx.beginPath();
          ctx.ellipse(centerX, yPos - currentHeight, radiusX, radiusY, 0, 0, Math.PI * 2);
          ctx.fill();

          // Edge glow
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * risePhase})`;
          ctx.lineWidth = 2 * scaleFactor;
          ctx.stroke();
        }

        // Solidifying phase (0.7 - 1.0): becomes solid with glass texture
        else {
          const solidPhase = (morphProgress - 0.7) / 0.3;
          ctx.globalAlpha = 1;

          // Solid cylinder body with glass effect
          const solidGrad = ctx.createLinearGradient(
            centerX - radiusX, yPos - height,
            centerX + radiusX, yPos
          );
          solidGrad.addColorStop(0, `hsl(${hue}, 85%, 75%)`);
          solidGrad.addColorStop(0.2, `hsl(${hue}, 75%, 88%)`);
          solidGrad.addColorStop(0.5, `hsl(${hue}, 65%, 96%)`);
          solidGrad.addColorStop(0.8, `hsl(${hue}, 75%, 90%)`);
          solidGrad.addColorStop(1, `hsl(${hue}, 80%, 78%)`);

          ctx.fillStyle = solidGrad;
          ctx.beginPath();
          ctx.moveTo(centerX - radiusX, yPos);
          ctx.lineTo(centerX - radiusX, yPos - height);
          ctx.ellipse(centerX, yPos - height, radiusX, radiusY, 0, Math.PI, 0, true);
          ctx.lineTo(centerX + radiusX, yPos);
          ctx.ellipse(centerX, yPos, radiusX, radiusY, 0, 0, Math.PI, false);
          ctx.fill();

          // Glass-like top surface
          const glassTop = ctx.createRadialGradient(
            centerX - 40 * scaleFactor, yPos - height - 15 * scaleFactor, 10 * scaleFactor,
            centerX, yPos - height, radiusX
          );
          glassTop.addColorStop(0, "rgba(255, 255, 255, 1)");
          glassTop.addColorStop(0.4, `hsla(${hue}, 60%, 98%, 0.95)`);
          glassTop.addColorStop(0.8, `hsla(${hue}, 70%, 92%, 0.95)`);
          glassTop.addColorStop(1, `hsla(${hue}, 75%, 88%, 1)`);

          ctx.fillStyle = glassTop;
          ctx.beginPath();
          ctx.ellipse(centerX, yPos - height, radiusX, radiusY, 0, 0, Math.PI * 2);
          ctx.fill();

          // Frosted glass edge
          ctx.strokeStyle = `hsla(${hue}, 60%, 65%, ${0.3 + solidPhase * 0.4})`;
          ctx.lineWidth = 1.5 * scaleFactor;
          ctx.stroke();

          // Glass highlight shine
          const shinePos = (time * 0.0005 % 1) * radiusX * 2 - radiusX;
          ctx.save();
          ctx.globalAlpha = 0.4 * solidPhase;
          const shineGrad = ctx.createLinearGradient(
            centerX + shinePos - 20 * scaleFactor, yPos - height,
            centerX + shinePos + 20 * scaleFactor, yPos - height
          );
          shineGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
          shineGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.6)");
          shineGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = shineGrad;
          ctx.fillRect(centerX + shinePos - 20 * scaleFactor, yPos - height - radiusY,
            40 * scaleFactor, height + radiusY);
          ctx.restore();

          // Frosted dots decoration
          if (solidPhase > 0.5) {
            const dotAlpha = (solidPhase - 0.5) * 2;
            const dotCount = Math.floor(radiusX / 15);
            for (let d = 0; d < dotCount; d++) {
              const angle = (d / dotCount) * Math.PI * 2;
              const dotX = centerX + Math.cos(angle) * radiusX * 0.85;
              const dotY = yPos - height * 0.5 + Math.sin(angle) * radiusY * 0.5;
              ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * dotAlpha})`;
              ctx.beginPath();
              ctx.arc(dotX, dotY, 2.5 * scaleFactor, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        ctx.restore();
      };

      // TIER 1: Bottom layer (0 - 0.35 progress)
      const tier1Progress = Math.max(0, Math.min(1, progress / 0.35));
      drawLiquidTier(
        baseCenterY,
        140 * scaleFactor,
        35 * scaleFactor,
        75 * scaleFactor,
        tier1Progress,
        345 // rose hue
      );

      // TIER 2: Middle layer (0.25 - 0.60 progress)
      const tier2Progress = Math.max(0, Math.min(1, (progress - 0.25) / 0.35));
      drawLiquidTier(
        baseCenterY - 75 * scaleFactor,
        105 * scaleFactor,
        28 * scaleFactor,
        70 * scaleFactor,
        tier2Progress,
        350 // slightly shifted rose hue
      );

      // TIER 3: Top layer (0.50 - 0.85 progress)
      const tier3Progress = Math.max(0, Math.min(1, (progress - 0.50) / 0.35));
      drawLiquidTier(
        baseCenterY - 145 * scaleFactor,
        70 * scaleFactor,
        20 * scaleFactor,
        60 * scaleFactor,
        tier3Progress,
        355 // pink-rose hue
      );

      // CANDLES (0.70 -> 1.0): Materialize from liquid glass
      const candleProgress = Math.max(0, Math.min(1, (progress - 0.70) / 0.30));
      if (candleProgress > 0) {
        ctx.save();
        const topY = baseCenterY - 205 * scaleFactor;
        const candlePositions = [-35 * scaleFactor, 0, 35 * scaleFactor];

        candlePositions.forEach((cxOffset, idx) => {
          const candleX = centerX + cxOffset;
          const candleAppear = Math.max(0, Math.min(1, (candleProgress - idx * 0.1) * 1.5));

          if (candleAppear > 0) {
            ctx.globalAlpha = candleAppear;

            // Liquid glass candle (0 - 0.5 phase)
            if (candleAppear < 0.5) {
              const liquidPhase = candleAppear / 0.5;
              const candleH = 30 * scaleFactor * liquidPhase;

              // Liquid candle gradient
              const liquidCandleGrad = ctx.createLinearGradient(
                candleX, topY - candleH, candleX, topY
              );
              liquidCandleGrad.addColorStop(0, "rgba(253, 224, 71, 0.7)");
              liquidCandleGrad.addColorStop(0.5, "rgba(255, 251, 235, 0.8)");
              liquidCandleGrad.addColorStop(1, "rgba(245, 158, 11, 0.7)");

              ctx.fillStyle = liquidCandleGrad;

              // Rippling liquid candle shape
              ctx.beginPath();
              for (let a = 0; a < Math.PI * 2; a += 0.1) {
                const ripple = Math.sin(a * 8 + time * 0.005) * 0.5 * scaleFactor * (1 - liquidPhase);
                const r = 3.5 * scaleFactor + ripple;
                const x = candleX + Math.cos(a) * r;
                const y = topY - candleH * 0.5 + Math.sin(a) * (candleH * 0.5);
                if (a === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.fill();
            }
            // Solid glass candle (0.5 - 1.0 phase)
            else {
              const solidPhase = (candleAppear - 0.5) / 0.5;
              const candleH = 30 * scaleFactor;

              // Frosted glass candle
              const candleGrad = ctx.createLinearGradient(
                candleX - 4 * scaleFactor, 0,
                candleX + 4 * scaleFactor, 0
              );
              candleGrad.addColorStop(0, "#FDE047");
              candleGrad.addColorStop(0.5, "#FFFBEB");
              candleGrad.addColorStop(1, "#FBBF24");

              ctx.fillStyle = candleGrad;
              ctx.fillRect(
                candleX - 3.5 * scaleFactor,
                topY - candleH,
                7 * scaleFactor,
                candleH
              );

              // Glass highlight
              ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
              ctx.fillRect(
                candleX - 1.5 * scaleFactor,
                topY - candleH,
                2 * scaleFactor,
                candleH
              );

              // Wick
              ctx.strokeStyle = "#451A03";
              ctx.lineWidth = 1.2 * scaleFactor;
              ctx.beginPath();
              ctx.moveTo(candleX, topY - candleH);
              ctx.lineTo(candleX, topY - candleH - 6 * scaleFactor);
              ctx.stroke();

              // FLAME (appears after solid phase > 0.3)
              const flameIgnition = Math.max(0, Math.min(1, (solidPhase - 0.3) / 0.7));
              if (flameIgnition > 0) {
                const flicker = Math.sin(time * 0.008 + idx * 2.2) * 2;
                const flameW = (5.5 + flicker * 0.3) * scaleFactor * flameIgnition;
                const flameH = (16 + flicker) * scaleFactor * flameIgnition;
                const flameCenterY = topY - candleH - 6 * scaleFactor - flameH / 2;

                // Flame halo
                const halo = ctx.createRadialGradient(
                  candleX, flameCenterY, 2 * scaleFactor,
                  candleX, flameCenterY, 55 * scaleFactor * flameIgnition
                );
                halo.addColorStop(0, `rgba(251, 191, 36, ${0.5 * flameIgnition})`);
                halo.addColorStop(0.5, `rgba(244, 63, 94, ${0.25 * flameIgnition})`);
                halo.addColorStop(1, "rgba(255, 245, 247, 0)");
                ctx.fillStyle = halo;
                ctx.beginPath();
                ctx.arc(candleX, flameCenterY, 55 * scaleFactor * flameIgnition, 0, Math.PI * 2);
                ctx.fill();

                // Inner flame
                const flameGrad = ctx.createRadialGradient(
                  candleX, flameCenterY + flameH * 0.2, 1 * scaleFactor,
                  candleX, flameCenterY, flameH
                );
                flameGrad.addColorStop(0, "#FFFFFF");
                flameGrad.addColorStop(0.3, "#FDE047");
                flameGrad.addColorStop(0.7, "#F97316");
                flameGrad.addColorStop(1, "rgba(225, 29, 72, 0)");

                ctx.fillStyle = flameGrad;
                ctx.beginPath();
                ctx.moveTo(candleX, flameCenterY - flameH / 2);
                ctx.quadraticCurveTo(
                  candleX + flameW, flameCenterY + flameH * 0.2,
                  candleX, flameCenterY + flameH / 2
                );
                ctx.quadraticCurveTo(
                  candleX - flameW, flameCenterY + flameH * 0.2,
                  candleX, flameCenterY - flameH / 2
                );
                ctx.fill();
              }
            }
          }
        });

        ctx.restore();
      }

      // Sparkles around fully formed cake (0.80+)
      if (progress >= 0.80) {
        ctx.save();
        const sparkleCount = 12;
        for (let s = 0; s < sparkleCount; s++) {
          const sAngle = (s / sparkleCount) * Math.PI * 2 + time * 0.0005;
          const sDist = (110 + Math.sin(time * 0.002 + s) * 35) * scaleFactor;
          const sx = centerX + Math.cos(sAngle) * sDist;
          const sy = (baseCenterY - 100 * scaleFactor) + Math.sin(sAngle) * (sDist * 0.6);
          const sSize = (2 + Math.sin(time * 0.004 + s * 1.5) * 1.5) * scaleFactor;
          const sparkleAlpha = 0.6 + Math.sin(time * 0.003 + s) * 0.4;

          ctx.globalAlpha = sparkleAlpha;
          ctx.fillStyle = s % 3 === 0 ? "#F43F5E" : s % 3 === 1 ? "#FDE047" : "#FB7185";
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(1, sSize), 0, Math.PI * 2);
          ctx.fill();

          // Sparkle cross
          if (sSize > 2) {
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sx - sSize * 1.5, sy);
            ctx.lineTo(sx + sSize * 1.5, sy);
            ctx.moveTo(sx, sy - sSize * 1.5);
            ctx.lineTo(sx, sy + sSize * 1.5);
            ctx.stroke();
          }
        }
        ctx.restore();
      }
    },
    []
  );

  // 60fps High-DPI Render Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const render = (time: number) => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const displayWidth = rect.width || window.innerWidth || 800;
      const displayHeight = rect.height || window.innerHeight || 600;

      const targetWidth = Math.floor(displayWidth * dpr);
      const targetHeight = Math.floor(displayHeight * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const currentProgress = smoothProgress.get();

      if (imagesLoaded && images.length >= TOTAL_FRAMES) {
        const frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.floor(currentProgress * (TOTAL_FRAMES - 1)))
        );
        const img = images[frameIndex];

        if (img && img.complete && img.naturalWidth > 0) {
          ctx.fillStyle = "#FFF5F7";
          ctx.fillRect(0, 0, displayWidth, displayHeight);

          const scale = Math.min(
            displayWidth / img.naturalWidth,
            displayHeight / img.naturalHeight
          );
          const dx = (displayWidth - img.naturalWidth * scale) / 2;
          const dy = (displayHeight - img.naturalHeight * scale) / 2;

          ctx.drawImage(
            img,
            dx,
            dy,
            img.naturalWidth * scale,
            img.naturalHeight * scale
          );
        } else {
          drawProceduralCake(ctx, displayWidth, displayHeight, currentProgress, time);
        }
      } else {
        drawProceduralCake(ctx, displayWidth, displayHeight, currentProgress, time);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [imagesLoaded, images, smoothProgress, drawProceduralCake]);

  const handleCakeClick = () => {
    if (isCakeClickable) {
      setShowLetter(true);
    }
  };

  return (
    <>
      {/* PRELOADER SCREEN */}
      <AnimatePresence>
        {loadProgress < 100 && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFF5F7]"
          >
            <div className="relative flex flex-col items-center">
              <div className="relative mb-6">
                <motion.div
                  animate={{
                    scale: [1, 1.18, 1],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-16 h-16 text-rose-500 drop-shadow-md flex items-center justify-center"
                >
                  <CakeEmblemIcon className="w-14 h-14" />
                </motion.div>
                <div className="absolute -top-1 -right-1 text-rose-400">
                  <SparkleIcon className="w-4 h-4 animate-spin" />
                </div>
              </div>

              <span className="font-editorial text-2xl text-[#4C0519] font-medium tracking-wide mb-2">
                Assembling Best Friend Celebration
              </span>

              <p className="font-sans text-xs text-[#881337]/70 uppercase tracking-widest mb-6">
                Gathering our sweetest memories & adventures...
              </p>

              {/* Progress Bar */}
              <div className="w-48 h-1.5 bg-rose-200/50 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadProgress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              <span className="mt-3 text-xs font-mono text-[#881337]/60">
                {loadProgress}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 450vh LUXURIOUS SCROLL CONTAINER */}
      <div ref={containerRef} className="relative h-[450vh] w-full bg-[#FFF5F7]">
        {/* STICKY VIEWPORT CONTAINER */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          {/* HTML5 60FPS CANVAS */}
          <canvas
            ref={canvasRef}
            className={`w-full h-full block touch-none select-none ${isCakeClickable ? "cursor-pointer" : "cursor-default"
              }`}
            onClick={handleCakeClick}
            onMouseEnter={() => isCakeClickable && setIsHoveringCake(true)}
            onMouseLeave={() => setIsHoveringCake(false)}
            aria-label="Interactive Birthday Cake Animation"
          />

          {/* SCROLLYTELLING TEXT OVERLAYS */}

          {/* 1. HERO TITLE: 0% - 18% (Best Friend Theme) */}
          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between py-10 md:py-14 px-6 text-center"
          >
            <div className="mt-3 md:mt-6 flex flex-col items-center max-w-xl">
              <div className="inline-flex items-center space-x-2 text-rose-600 text-xs font-semibold uppercase tracking-[0.25em] mb-3 glass-pill px-4 py-1.5 rounded-full">
                <SparkleIcon className="w-3.5 h-3.5" />
                <span>To My Partner In Crime</span>
                <SparkleIcon className="w-3.5 h-3.5" />
              </div>

              <h1 className="liquid-glass-text font-editorial text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.08] mb-3">
                Happy Birthday, <br />
                <span className="italic font-light">Bestie</span>
              </h1>

              <p className="font-sans text-xs sm:text-base text-[#881337]/80 max-w-md mx-auto leading-relaxed">
                Scroll gently to celebrate another legendary year of wild laughs, unfiltered memories, and adventures.
              </p>
            </div>

            {/* Scroll Down Prompt */}
            <div className="flex flex-col items-center space-y-2 text-rose-500 mb-2">
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#881337]/70">
                Scroll Down
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-8 h-8 rounded-full border border-rose-300 flex items-center justify-center bg-white/70 shadow-sm"
              >
                <ScrollArrowIcon className="w-4 h-4 text-rose-600" />
              </motion.div>
            </div>
          </motion.div>

          {/* 2. STORY BEAT 1: 25% - 45% (Left Aligned Card) */}
          <motion.div
            style={{ opacity: section2Opacity, x: section2X }}
            className="pointer-events-none absolute left-6 md:left-14 lg:left-20 top-1/2 -translate-y-1/2 max-w-xs sm:max-w-sm md:max-w-md z-10"
          >
            <div className="liquid-glass-panel p-6 md:p-8 rounded-3xl shadow-xl">
              <div className="flex items-center space-x-2 text-rose-600 mb-2">
                <CakeEmblemIcon className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest font-semibold text-[#881337]/70">
                  Tier by Tier
                </span>
              </div>

              <h2 className="frosted-glass-text font-editorial text-2xl md:text-3xl font-medium mb-3" data-text="Unfiltered & Unstoppable.">
                Unfiltered & Unstoppable.
              </h2>

              <p className="font-sans text-sm text-[#881337]/80 leading-relaxed">
                From chaotic late-night conversations to laughing until our stomachs hurt over things nobody else understands, having you as my best friend is the greatest blessing.
              </p>
            </div>
          </motion.div>

          {/* 3. STORY BEAT 2: 55% - 75% (Right Aligned Card) */}
          <motion.div
            style={{ opacity: section3Opacity, x: section3X }}
            className="pointer-events-none absolute right-6 md:right-14 lg:right-20 top-1/2 -translate-y-1/2 max-w-xs sm:max-w-sm md:max-w-md z-10"
          >
            <div className="liquid-glass-panel p-6 md:p-8 rounded-3xl shadow-xl text-right">
              <div className="flex items-center justify-end space-x-2 text-rose-600 mb-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#881337]/70">
                  Florals In Bloom
                </span>
                <SparkleIcon className="w-4 h-4" />
              </div>

              <h2 className="frosted-glass-text font-editorial text-2xl md:text-3xl font-medium mb-3" data-text="Your Brightest Year Yet.">
                Your Brightest Year Yet.
              </h2>

              <p className="font-sans text-sm text-[#881337]/80 leading-relaxed">
                You bring pure energy, honesty, and warmth to everyone lucky enough to know you. May this new chapter bring you wild success, peace of mind, and dream adventures.
              </p>
            </div>
          </motion.div>

          {/* 4. STORY BEAT 3: 85% - 100% (MOVED TO THE SIDE: CAKE IS FULLY VISIBLE & UNOBSTRUCTED) */}
          <motion.div
            style={{ opacity: section4Opacity, x: section4X }}
            className="absolute bottom-8 md:bottom-14 right-6 md:right-10 lg:right-16 max-w-xs sm:max-w-sm z-20"
          >
            <div className="frosted-glass-card p-5 md:p-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center space-x-2 text-rose-600 text-[11px] font-semibold uppercase tracking-widest mb-2 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/50">
                <FlameIcon className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>The Candles Are Glowing</span>
              </div>

              <h2 className="frosted-glass-text font-editorial text-2xl md:text-3xl font-normal mb-1.5" data-text="A Toast to You.">
                A Toast to You.
              </h2>

              <p className="font-sans text-xs md:text-sm text-[#881337]/75 mb-4 leading-relaxed">
                The cake is ready and the candles are glowing bright. Make your wish and open your handwritten birthday letter.
              </p>

              {/* Tap to Open Handwritten Letter Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowLetter(true)}
                className="morph-glass-btn w-full py-3 px-5 rounded-full text-rose-700 font-medium text-xs md:text-sm shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-rose-200"
              >
                <FeatherQuillIcon className="w-4 h-4" />
                <span>Tap the Cake For Surprise</span>
                <SparkleIcon className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Interactive Cake Hover Cue: positioned above cake tiers so it never covers the cake */}
          {/* {isCakeClickable && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-[16%] md:top-[18%] left-1/2 -translate-x-1/2 z-30 pointer-events-auto cursor-pointer"
              onClick={handleCakeClick}
            >
              <div className="glass-pill px-4 py-2 rounded-full text-xs font-semibold text-rose-700 flex items-center space-x-2 shadow-md hover:scale-105 active:scale-95 transition-transform">
                <FeatherQuillIcon className="w-3.5 h-3.5 text-rose-500" />
                <span>Tap to Open Handwritten Letter</span>
                <SparkleIcon className="w-3.5 h-3.5 text-rose-500" />
              </div>
            </motion.div>
          )} */}
        </div>
      </div>

      {/* INTERACTIVE BIRTHDAY LETTER MODAL */}
      <BirthdayLetter isOpen={showLetter} onClose={() => setShowLetter(false)} />
    </>
  );
};
