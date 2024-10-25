"use client";

import { useEffect } from "react";

const DynamicHeight = () => {
  useEffect(() => {
    const setDynamicVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // Set the height initially
    setDynamicVH();

    // Update height on resize
    window.addEventListener("resize", setDynamicVH);

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener("resize", setDynamicVH);
  }, []);

  return null; // No UI needed, just the effect
};

export default DynamicHeight;
