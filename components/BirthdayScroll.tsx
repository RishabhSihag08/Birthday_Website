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

  // Procedural Masterpiece Birthday Cake Renderer
  // Carefully centered at height * 0.48 so the entire cake is 100% visible and never covered
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
      // Positioned higher up (height * 0.48) to give abundant breathing room
      const baseCenterY = height * 0.48;
      const scaleFactor = Math.min(Math.max(width / 750, 0.62), Math.max(height / 650, 0.62), 1.1);

      // Soft ambient table glow
      const tableGlow = ctx.createRadialGradient(
        centerX,
        baseCenterY + 20 * scaleFactor,
        20 * scaleFactor,
        centerX,
        baseCenterY + 20 * scaleFactor,
        340 * scaleFactor
      );
      tableGlow.addColorStop(0, "rgba(251, 113, 133, 0.16)");
      tableGlow.addColorStop(0.5, "rgba(255, 228, 233, 0.08)");
      tableGlow.addColorStop(1, "rgba(255, 245, 247, 0)");
      ctx.fillStyle = tableGlow;
      ctx.beginPath();
      ctx.ellipse(centerX, baseCenterY + 20 * scaleFactor, 320 * scaleFactor, 90 * scaleFactor, 0, 0, Math.PI * 2);
      ctx.fill();

      // PEDESTAL STAND (Always visible from start)
      ctx.save();
      ctx.translate(centerX, baseCenterY + 40 * scaleFactor);

      // Pedestal drop shadow
      ctx.fillStyle = "rgba(136, 19, 55, 0.09)";
      ctx.beginPath();
      ctx.ellipse(0, 24 * scaleFactor, 190 * scaleFactor, 36 * scaleFactor, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pedestal plate
      const plateGrad = ctx.createLinearGradient(-190 * scaleFactor, 0, 190 * scaleFactor, 0);
      plateGrad.addColorStop(0, "#FFFFFF");
      plateGrad.addColorStop(0.3, "#FFF5F7");
      plateGrad.addColorStop(0.7, "#FFE4E9");
      plateGrad.addColorStop(1, "#FECDD6");
      ctx.fillStyle = plateGrad;
      ctx.strokeStyle = "rgba(244, 63, 94, 0.35)";
      ctx.lineWidth = 2 * scaleFactor;

      ctx.beginPath();
      ctx.ellipse(0, 0, 200 * scaleFactor, 42 * scaleFactor, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Porcelain stem
      const stemGrad = ctx.createLinearGradient(-35 * scaleFactor, 0, 35 * scaleFactor, 0);
      stemGrad.addColorStop(0, "#FFFFFF");
      stemGrad.addColorStop(0.5, "#FFE4E9");
      stemGrad.addColorStop(1, "#FECDD6");
      ctx.fillStyle = stemGrad;
      ctx.beginPath();
      ctx.moveTo(-30 * scaleFactor, 0);
      ctx.quadraticCurveTo(-15 * scaleFactor, 18 * scaleFactor, -60 * scaleFactor, 26 * scaleFactor);
      ctx.lineTo(60 * scaleFactor, 26 * scaleFactor);
      ctx.quadraticCurveTo(15 * scaleFactor, 18 * scaleFactor, 30 * scaleFactor, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(244, 63, 94, 0.25)";
      ctx.stroke();
      ctx.restore();

      // TIER 1: Bottom Base Layer (Always visible, scalloped pearl trim)
      ctx.save();
      const currentY1 = baseCenterY;
      const rX1 = 160 * scaleFactor;
      const rY1 = 40 * scaleFactor;
      const tierHeight1 = 70 * scaleFactor;

      // Tier 1 Cylinder Body
      const bodyGrad1 = ctx.createLinearGradient(centerX - rX1, 0, centerX + rX1, 0);
      bodyGrad1.addColorStop(0, "#FB7185");
      bodyGrad1.addColorStop(0.2, "#FECDD6");
      bodyGrad1.addColorStop(0.55, "#FFF5F7");
      bodyGrad1.addColorStop(0.85, "#FECDD6");
      bodyGrad1.addColorStop(1, "#F43F5E");

      ctx.fillStyle = bodyGrad1;
      ctx.beginPath();
      ctx.moveTo(centerX - rX1, currentY1);
      ctx.lineTo(centerX - rX1, currentY1 - tierHeight1);
      ctx.ellipse(centerX, currentY1 - tierHeight1, rX1, rY1, 0, Math.PI, 0, true);
      ctx.lineTo(centerX + rX1, currentY1);
      ctx.ellipse(centerX, currentY1, rX1, rY1, 0, 0, Math.PI, false);
      ctx.fill();

      // Tier 1 Top
      const topGrad1 = ctx.createRadialGradient(
        centerX - 30 * scaleFactor,
        currentY1 - tierHeight1 - 10 * scaleFactor,
        10 * scaleFactor,
        centerX,
        currentY1 - tierHeight1,
        rX1
      );
      topGrad1.addColorStop(0, "#FFFFFF");
      topGrad1.addColorStop(0.7, "#FFF0F3");
      topGrad1.addColorStop(1, "#FECDD6");
      ctx.fillStyle = topGrad1;
      ctx.beginPath();
      ctx.ellipse(centerX, currentY1 - tierHeight1, rX1, rY1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(244, 63, 94, 0.25)";
      ctx.lineWidth = 1.5 * scaleFactor;
      ctx.stroke();

      // Pearl frosting pearls along bottom edge of Tier 1
      const pearlCount1 = 26;
      for (let p = 0; p < pearlCount1; p++) {
        const angle = (p / pearlCount1) * Math.PI;
        const px = centerX + Math.cos(angle) * (rX1 + 2 * scaleFactor);
        const py = currentY1 + Math.sin(angle) * (rY1 + 2 * scaleFactor);
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(px, py, 4.5 * scaleFactor, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // TIER 2: Middle Layer (Drops into place: 0.12 -> 0.45)
      const tier2Progress = Math.max(0, Math.min(1, (progress - 0.12) / 0.32));
      if (tier2Progress > 0) {
        ctx.save();
        const dropOffset2 = (1 - tier2Progress) * -110 * scaleFactor;
        const currentY2 = baseCenterY - 70 * scaleFactor + dropOffset2;
        ctx.globalAlpha = Math.min(1, tier2Progress * 1.4);

        const rX2 = 118 * scaleFactor;
        const rY2 = 30 * scaleFactor;
        const tierHeight2 = 65 * scaleFactor;

        const bodyGrad2 = ctx.createLinearGradient(centerX - rX2, 0, centerX + rX2, 0);
        bodyGrad2.addColorStop(0, "#FDA4AF");
        bodyGrad2.addColorStop(0.25, "#FECDD6");
        bodyGrad2.addColorStop(0.65, "#FFFFFF");
        bodyGrad2.addColorStop(0.85, "#FECDD6");
        bodyGrad2.addColorStop(1, "#FB7185");

        ctx.fillStyle = bodyGrad2;
        ctx.beginPath();
        ctx.moveTo(centerX - rX2, currentY2);
        ctx.lineTo(centerX - rX2, currentY2 - tierHeight2);
        ctx.ellipse(centerX, currentY2 - tierHeight2, rX2, rY2, 0, Math.PI, 0, true);
        ctx.lineTo(centerX + rX2, currentY2);
        ctx.ellipse(centerX, currentY2, rX2, rY2, 0, 0, Math.PI, false);
        ctx.fill();

        const topGrad2 = ctx.createRadialGradient(
          centerX - 20 * scaleFactor,
          currentY2 - tierHeight2 - 5 * scaleFactor,
          5 * scaleFactor,
          centerX,
          currentY2 - tierHeight2,
          rX2
        );
        topGrad2.addColorStop(0, "#FFFFFF");
        topGrad2.addColorStop(0.7, "#FFF5F7");
        topGrad2.addColorStop(1, "#FCE7F3");
        ctx.fillStyle = topGrad2;
        ctx.beginPath();
        ctx.ellipse(centerX, currentY2 - tierHeight2, rX2, rY2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(225, 29, 72, 0.2)";
        ctx.stroke();

        ctx.strokeStyle = "rgba(225, 29, 72, 0.4)";
        ctx.lineWidth = 2.5 * scaleFactor;
        ctx.beginPath();
        ctx.ellipse(centerX, currentY2 - tierHeight2 / 2, rX2 - 1, rY2 - 1, 0, 0, Math.PI);
        ctx.stroke();
        ctx.restore();
      }

      // TIER 3: Crown Layer (Drops into place: 0.38 -> 0.70)
      const tier3Progress = Math.max(0, Math.min(1, (progress - 0.38) / 0.30));
      if (tier3Progress > 0) {
        ctx.save();
        const dropOffset3 = (1 - tier3Progress) * -120 * scaleFactor;
        const currentY3 = baseCenterY - 135 * scaleFactor + dropOffset3;
        ctx.globalAlpha = Math.min(1, tier3Progress * 1.4);

        const rX3 = 76 * scaleFactor;
        const rY3 = 22 * scaleFactor;
        const tierHeight3 = 55 * scaleFactor;

        const bodyGrad3 = ctx.createLinearGradient(centerX - rX3, 0, centerX + rX3, 0);
        bodyGrad3.addColorStop(0, "#FDA4AF");
        bodyGrad3.addColorStop(0.3, "#FFF0F5");
        bodyGrad3.addColorStop(0.7, "#FFFFFF");
        bodyGrad3.addColorStop(0.9, "#FECDD6");
        bodyGrad3.addColorStop(1, "#FB7185");

        ctx.fillStyle = bodyGrad3;
        ctx.beginPath();
        ctx.moveTo(centerX - rX3, currentY3);
        ctx.lineTo(centerX - rX3, currentY3 - tierHeight3);
        ctx.ellipse(centerX, currentY3 - tierHeight3, rX3, rY3, 0, Math.PI, 0, true);
        ctx.lineTo(centerX + rX3, currentY3);
        ctx.ellipse(centerX, currentY3, rX3, rY3, 0, 0, Math.PI, false);
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.ellipse(centerX, currentY3 - tierHeight3, rX3, rY3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(225, 29, 72, 0.25)";
        ctx.stroke();
        ctx.restore();
      }

      // FLORALS & ROSES BLOOMING (0.45 -> 0.85)
      const floralProgress = Math.max(0, Math.min(1, (progress - 0.45) / 0.35));
      if (floralProgress > 0) {
        ctx.save();

        const blooms = [
          { x: centerX - 120 * scaleFactor, y: baseCenterY - 30 * scaleFactor, size: 22 * scaleFactor, color: "#E11D48" },
          { x: centerX + 115 * scaleFactor, y: baseCenterY - 25 * scaleFactor, size: 20 * scaleFactor, color: "#FB7185" },
          { x: centerX - 80 * scaleFactor, y: baseCenterY - 95 * scaleFactor, size: 18 * scaleFactor, color: "#FDA4AF" },
          { x: centerX + 75 * scaleFactor, y: baseCenterY - 90 * scaleFactor, size: 21 * scaleFactor, color: "#E11D48" },
          { x: centerX - 45 * scaleFactor, y: baseCenterY - 150 * scaleFactor, size: 16 * scaleFactor, color: "#BE123C" },
          { x: centerX + 50 * scaleFactor, y: baseCenterY - 145 * scaleFactor, size: 17 * scaleFactor, color: "#FDA4AF" },
        ];

        blooms.forEach((bloom, i) => {
          const itemProgress = Math.max(0, Math.min(1, (floralProgress - i * 0.08) * 1.8));
          if (itemProgress <= 0) return;

          ctx.save();
          ctx.translate(bloom.x, bloom.y);
          ctx.scale(itemProgress, itemProgress);

          ctx.fillStyle = "rgba(74, 120, 86, 0.75)";
          ctx.beginPath();
          ctx.ellipse(-bloom.size * 0.7, 0, bloom.size * 0.6, bloom.size * 0.25, -Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = bloom.color;
          for (let p = 0; p < 5; p++) {
            const rot = (p / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(
              Math.cos(rot) * (bloom.size * 0.35),
              Math.sin(rot) * (bloom.size * 0.35),
              bloom.size * 0.45,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }

          ctx.fillStyle = "#FFF0F3";
          ctx.beginPath();
          ctx.arc(0, 0, bloom.size * 0.28, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        ctx.restore();
      }

      // CANDLES & GLOWING FLAMES (0.70 -> 1.0)
      const candleProgress = Math.max(0, Math.min(1, (progress - 0.70) / 0.28));
      if (candleProgress > 0) {
        ctx.save();
        const topY = baseCenterY - 190 * scaleFactor;
        const candlePositions = [-30 * scaleFactor, 0, 30 * scaleFactor];

        candlePositions.forEach((cxOffset, idx) => {
          const candleX = centerX + cxOffset;
          const candleH = 34 * scaleFactor * candleProgress;

          const candleGrad = ctx.createLinearGradient(candleX - 4 * scaleFactor, 0, candleX + 4 * scaleFactor, 0);
          candleGrad.addColorStop(0, "#FDE047");
          candleGrad.addColorStop(0.5, "#FFFBEB");
          candleGrad.addColorStop(1, "#F59E0B");

          ctx.fillStyle = candleGrad;
          ctx.fillRect(
            candleX - 3.5 * scaleFactor,
            topY - candleH,
            7 * scaleFactor,
            candleH
          );

          ctx.strokeStyle = "#451A03";
          ctx.lineWidth = 1.2 * scaleFactor;
          ctx.beginPath();
          ctx.moveTo(candleX, topY - candleH);
          ctx.lineTo(candleX, topY - candleH - 6 * scaleFactor);
          ctx.stroke();

          // FLICKERING INNER FLAME & HALO
          const flameIgnition = Math.max(0, Math.min(1, (progress - 0.78) / 0.22));
          if (flameIgnition > 0) {
            const flicker = Math.sin(time * 0.008 + idx * 2.2) * 2;
            const flameW = (5.5 + flicker * 0.3) * scaleFactor * flameIgnition;
            const flameH = (14 + flicker) * scaleFactor * flameIgnition;
            const flameCenterY = topY - candleH - 6 * scaleFactor - flameH / 2;

            const halo = ctx.createRadialGradient(
              candleX,
              flameCenterY,
              2 * scaleFactor,
              candleX,
              flameCenterY,
              50 * scaleFactor * flameIgnition
            );
            halo.addColorStop(0, "rgba(251, 191, 36, 0.45)");
            halo.addColorStop(0.5, "rgba(244, 63, 94, 0.2)");
            halo.addColorStop(1, "rgba(255, 245, 247, 0)");
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(candleX, flameCenterY, 50 * scaleFactor * flameIgnition, 0, Math.PI * 2);
            ctx.fill();

            const flameGrad = ctx.createRadialGradient(
              candleX,
              flameCenterY + flameH * 0.2,
              1 * scaleFactor,
              candleX,
              flameCenterY,
              flameH
            );
            flameGrad.addColorStop(0, "#FFFFFF");
            flameGrad.addColorStop(0.3, "#FDE047");
            flameGrad.addColorStop(0.7, "#F97316");
            flameGrad.addColorStop(1, "rgba(225, 29, 72, 0)");

            ctx.fillStyle = flameGrad;
            ctx.beginPath();
            ctx.moveTo(candleX, flameCenterY - flameH / 2);
            ctx.quadraticCurveTo(
              candleX + flameW,
              flameCenterY + flameH * 0.2,
              candleX,
              flameCenterY + flameH / 2
            );
            ctx.quadraticCurveTo(
              candleX - flameW,
              flameCenterY + flameH * 0.2,
              candleX,
              flameCenterY - flameH / 2
            );
            ctx.fill();
          }
        });

        ctx.restore();
      }

      // Shimmering Particles around Cake
      if (progress >= 0.80) {
        ctx.save();
        const sparkleCount = 10;
        for (let s = 0; s < sparkleCount; s++) {
          const sAngle = (s / sparkleCount) * Math.PI * 2 + time * 0.0006;
          const sDist = (120 + Math.sin(time * 0.002 + s) * 40) * scaleFactor;
          const sx = centerX + Math.cos(sAngle) * sDist;
          const sy = (baseCenterY - 110 * scaleFactor) + Math.sin(sAngle) * (sDist * 0.55);
          const sSize = (2 + Math.sin(time * 0.005 + s * 1.5) * 1.5) * scaleFactor;

          ctx.fillStyle = s % 2 === 0 ? "rgba(244, 63, 94, 0.85)" : "rgba(251, 191, 36, 0.95)";
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(1, sSize), 0, Math.PI * 2);
          ctx.fill();
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

              <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-[#4C0519] tracking-tight leading-[1.08] mb-3">
                Happy Birthday, <br />
                <span className="italic font-light text-rose-600">Bestie</span>
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
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-rose-200/70 shadow-xl">
              <div className="flex items-center space-x-2 text-rose-600 mb-2">
                <CakeEmblemIcon className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest font-semibold text-[#881337]/70">
                  Tier by Tier
                </span>
              </div>

              <h2 className="font-editorial text-2xl md:text-3xl text-[#4C0519] font-medium mb-3">
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
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-rose-200/70 shadow-xl text-right">
              <div className="flex items-center justify-end space-x-2 text-rose-600 mb-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#881337]/70">
                  Florals In Bloom
                </span>
                <SparkleIcon className="w-4 h-4" />
              </div>

              <h2 className="font-editorial text-2xl md:text-3xl text-[#4C0519] font-medium mb-3">
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
            <div className="glass-panel p-5 md:p-7 rounded-3xl border border-rose-300/80 shadow-2xl flex flex-col items-start text-left">
              <div className="inline-flex items-center space-x-2 text-rose-600 text-[11px] font-semibold uppercase tracking-widest mb-2 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/50">
                <FlameIcon className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>The Candles Are Glowing</span>
              </div>

              <h2 className="font-editorial text-2xl md:text-3xl text-[#4C0519] font-normal mb-1.5">
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
                className="w-full py-3 px-5 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 text-white font-medium text-xs md:text-sm shadow-lg hover:shadow-rose-400/30 transition-all flex items-center justify-center space-x-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-rose-200"
              >
                <FeatherQuillIcon className="w-4 h-4 text-white" />
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
