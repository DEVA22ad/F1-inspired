"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CursorOverlay() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (
      !cursor ||
      window.matchMedia("(hover: none) or (pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // GSAP quickTo for zero-RAF, hardware-accelerated smooth cursor lag
    const setX = gsap.quickTo(cursor, "x", { duration: 0.12, ease: "power2.out" });
    const setY = gsap.quickTo(cursor, "y", { duration: 0.12, ease: "power2.out" });

    let isVisible = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = "1";
      }
      setX(e.clientX);
      setY(e.clientY);
    };

    const handleMouseLeave = () => {
      isVisible = false;
      cursor.style.opacity = "0";
    };

    // Subtle hover state on interactive controls
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = target.closest("button, a, [role='button'], input, .cursor-pointer");
      if (isInteractive) {
        cursor.classList.add("cursor-hover");
      } else {
        cursor.classList.remove("cursor-hover");
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div
      id="cursor-overlay"
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-[opacity,transform] duration-150 will-change-transform hidden md:block select-none"
      aria-hidden="true"
    >
      <div className="cursor-dot" />
      <div className="cursor-crosshair ch-x" />
      <div className="cursor-crosshair ch-y" />
      <div className="cursor-ring" />
    </div>
  );
}
