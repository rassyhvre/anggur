/**
 * FallingLeaves.jsx
 * =================
 * Animated falling grape leaves background component.
 * 
 * Features:
 * - Multiple grape leaf SVGs with natural variation
 * - Random size, rotation, speed, and sway per leaf
 * - Fade in at top, fade out at bottom
 * - Responsive: fewer leaves on smaller screens
 * - Toggle animation on/off
 * - GPU-accelerated CSS animations for smooth 60fps
 * 
 * Usage:
 *   <FallingLeaves count={18} />
 *   <FallingLeaves count={18} overlay overlayColor="rgba(5,46,22,0.6)" />
 */

import { useState, useMemo, useEffect } from "react";
import "./FallingLeaves.css";

/* ============================================================
   GRAPE LEAF SVG VARIANTS
   4 different leaf shapes for natural variety
   ============================================================ */
const LEAF_VARIANTS = [
  // Variant 1: Classic grape leaf shape (5-lobed)
  (color) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 95 C50 95 48 75 30 60 C12 45 5 35 10 25 C15 15 25 10 35 15 
           C40 5 50 2 50 2 C50 2 60 5 65 15 C75 10 85 15 90 25 
           C95 35 88 45 70 60 C52 75 50 95 50 95Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M50 90 C50 90 50 55 50 20"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M50 45 C40 35 25 30 20 28 M50 55 C60 45 75 38 80 36 M50 35 C58 25 68 20 72 18"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  ),

  // Variant 2: Rounder grape leaf
  (color) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 93 C45 80 25 68 15 55 C5 42 8 28 18 20 C28 12 38 14 45 22 
           C48 10 52 5 55 10 C58 14 62 12 72 20 C82 28 85 42 75 55 
           C65 68 55 80 50 93Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M50 88 L50 25"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M50 50 C38 42 22 38 18 36 M50 40 C62 32 75 28 82 28"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  ),

  // Variant 3: Elongated leaf with pointed lobes
  (color) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 96 C48 82 32 65 20 52 C8 39 5 25 15 15 C25 8 38 12 45 20 
           C48 8 52 4 55 8 C55 12 65 8 75 15 C85 25 82 39 70 52 
           C58 65 52 82 50 96Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M50 90 L50 18"
        stroke="rgba(255,255,255,0.13)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M50 48 L28 32 M50 38 L72 22 M50 58 L25 48 M50 55 L78 42"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
    </svg>
  ),

  // Variant 4: Smaller simpler leaf
  (color) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 92 C46 78 30 62 22 50 C14 38 16 24 26 18 C36 12 44 18 48 26 
           C50 12 52 8 52 26 C56 18 64 12 74 18 C84 24 86 38 78 50 
           C70 62 54 78 50 92Z"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M50 85 L50 22"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  ),
];

/* ============================================================
   LEAF COLOR PALETTE
   Natural grape leaf tones – greens, yellows, autumn hues
   ============================================================ */
const LEAF_COLORS = [
  "#2d7a3a",  // Deep vineyard green
  "#3a8f4a",  // Forest green
  "#4aa85c",  // Fresh green
  "#5b9e3d",  // Lime-green
  "#7ab648",  // Yellow-green
  "#8fad2f",  // Chartreuse
  "#a6922b",  // Autumn gold
  "#7e8c33",  // Olive green
  "#4d7a3c",  // Muted green
  "#3c6b30",  // Dark sage
];

/* ============================================================
   RANDOM HELPERS
   ============================================================ */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

/* ============================================================
   GENERATE LEAF DATA
   Creates an array of leaf configs with randomized properties
   ============================================================ */
function generateLeaves(count) {
  return Array.from({ length: count }, (_, i) => {
    const color = pick(LEAF_COLORS);
    const variant = randInt(0, LEAF_VARIANTS.length - 1);
    const size = rand(22, 50);          // px – leaf size
    const opacity = rand(0.25, 0.55);   // 0.25–0.55 to not distract
    const left = rand(0, 100);          // % – horizontal position
    const duration = rand(10, 22);      // seconds – fall speed
    const delay = rand(0, 15);          // seconds – stagger start
    const sway = rand(20, 60);          // px – horizontal sway amplitude
    const swayDuration = rand(3, 6);    // seconds – sway cycle speed
    const spinAmount = rand(-360, 360); // deg – total rotation
    const spinDuration = rand(8, 18);   // seconds – spin cycle speed
    const startRot = rand(0, 360);      // deg – initial random rotation

    return {
      id: i,
      color,
      variant,
      size,
      opacity,
      left,
      duration,
      delay,
      sway,
      swayDuration,
      spinAmount,
      spinDuration,
      startRot,
    };
  });
}

/* ============================================================
   COMPONENT
   ============================================================ */
export default function FallingLeaves({
  count = 18,           // Number of leaves (desktop)
  mobileCount = 8,      // Number on mobile (<768px)
  overlay = false,       // Show dark gradient overlay?
  overlayColor = "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(5,46,22,0.35) 100%)",
  blur = false,          // Apply background blur?
  showToggle = true,     // Show on/off toggle button?
}) {
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount + resize
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Determine active leaf count
  const activeCount = isMobile ? mobileCount : count;

  // Generate leaf data (memoized so it doesn't re-randomize every render)
  const leaves = useMemo(() => generateLeaves(activeCount), [activeCount]);

  return (
    <div className={`falling-leaves ${paused ? "falling-leaves--paused" : ""}`}>
      {/* Optional dark overlay */}
      {overlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: overlayColor,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Optional blur layer */}
      {blur && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Render each leaf */}
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="falling-leaf"
          style={{
            "--leaf-left": `${leaf.left}%`,
            "--leaf-size": `${leaf.size}px`,
            "--leaf-opacity": leaf.opacity,
            "--leaf-duration": `${leaf.duration}s`,
            "--leaf-delay": `${leaf.delay}s`,
            "--leaf-sway": `${leaf.sway}px`,
            "--leaf-sway-duration": `${leaf.swayDuration}s`,
            "--leaf-spin": `${leaf.spinAmount}deg`,
            "--leaf-spin-duration": `${leaf.spinDuration}s`,
            "--leaf-start-rot": `${leaf.startRot}deg`,
          }}
        >
          {LEAF_VARIANTS[leaf.variant](leaf.color)}
        </div>
      ))}

      {/* Toggle button */}
      {showToggle && (
        <button
          className="falling-leaves-toggle"
          onClick={() => setPaused(!paused)}
          title={paused ? "Aktifkan animasi daun" : "Matikan animasi daun"}
        >
          {paused ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          )}
          {paused ? "Animasi" : "Jeda"}
        </button>
      )}
    </div>
  );
}
