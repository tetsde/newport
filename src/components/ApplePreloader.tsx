import { useEffect, useState } from "react";

interface ApplePreloaderProps {
  onComplete?: () => void;
}

const STATUS_MESSAGES = [
  "Initializing creative canvas...",
  "Loading intelligent workflows...",
  "Calibrating spatial interface...",
  "Ready to experience.",
];

export default function ApplePreloader({ onComplete }: ApplePreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exit" | "done">("loading");

  useEffect(() => {
    // Smooth progress increment with easing
    const startTime = performance.now();
    const duration = 1200; // 1.2s total smooth load

    let animationFrameId: number;

    const update = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Apple fluid cubic-bezier curve approx: 1 - Math.pow(1 - t, 3)
      const easedProgress = Math.round((1 - Math.pow(1 - t, 3)) * 100);
      setProgress(easedProgress);

      if (easedProgress < 35) {
        setStatusIndex(0);
      } else if (easedProgress < 70) {
        setStatusIndex(1);
      } else if (easedProgress < 95) {
        setStatusIndex(2);
      } else {
        setStatusIndex(3);
      }

      if (t < 1) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        // Hold for 250ms on 100% Ready, then trigger Apple exit sequence
        const exitTimer = setTimeout(() => {
          setPhase("exit");
          if (onComplete) onComplete();
          // After exit transition finishes, set to done
          const doneTimer = setTimeout(() => {
            setPhase("done");
          }, 850);
          return () => clearTimeout(doneTimer);
        }, 250);
        return () => clearTimeout(exitTimer);
      }
    };

    animationFrameId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  if (phase === "done") {
    return null;
  }

  const handleSkip = () => {
    setProgress(100);
    setPhase("exit");
    if (onComplete) onComplete();
    setTimeout(() => setPhase("done"), 500);
  };

  return (
    <div
      className={`apple-preloader ${phase === "exit" ? "apple-preloader--exit" : ""}`}
      aria-live="polite"
      aria-label="Loading portfolio experience"
    >
      {/* Background ambient lighting */}
      <div className="apple-preloader__glow apple-preloader__glow--1" />
      <div className="apple-preloader__glow apple-preloader__glow--2" />

      <div className="apple-preloader__content">
        {/* Apple Squircle Emblem */}
        <div className="apple-preloader__emblem">
          <div className="apple-preloader__emblem-inner">
            <svg
              className="apple-preloader__logo-svg"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="2"
                width="44"
                height="44"
                rx="14"
                stroke="url(#emblemBorderGrad)"
                strokeWidth="2"
              />
              <path
                d="M16 16V32M16 24H32M32 16V32"
                stroke="white"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="24" cy="24" r="2.5" fill="#ffffff" />
              <defs>
                <linearGradient
                  id="emblemBorderGrad"
                  x1="2"
                  y1="2"
                  x2="46"
                  y2="46"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#71717a" />
                  <stop offset="0.5" stopColor="#d4d4d8" />
                  <stop offset="1" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="apple-preloader__emblem-pulse" />
        </div>

        {/* Brand Name & Subtitle */}
        <div className="apple-preloader__meta">
          <h1 className="apple-preloader__title">HOAI NAM</h1>
          <p className="apple-preloader__subtitle">
            AI Engineer · Creative Technologist
          </p>
        </div>

        {/* Apple Fluid Progress Bar */}
        <div className="apple-preloader__track-container">
          <div className="apple-preloader__track">
            <div
              className="apple-preloader__bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="apple-preloader__info">
            <span className="apple-preloader__status">
              {STATUS_MESSAGES[statusIndex]}
            </span>
            <span className="apple-preloader__percent">
              {String(progress).padStart(2, "0")}%
            </span>
          </div>
        </div>

        {/* Skip button for instant entry */}
        <button
          className="apple-preloader__skip"
          onClick={handleSkip}
          type="button"
        >
          Skip Intro <span>→</span>
        </button>
      </div>
    </div>
  );
}
