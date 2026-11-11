"use client";

import { useEffect, useState } from "react";

export type DeviceClass = "mobile" | "tablet" | "desktop" | "ultrawide";
export type AspectOrientation = "portrait" | "square" | "landscape";

export interface ViewportProfile {
  width: number;
  height: number;
  aspectRatio: number;
  orientation: AspectOrientation;
  deviceClass: DeviceClass;
  isTouchDevice: boolean;
  isMobileViewport: boolean;
  containerClass: string;
  heroHeadingClass: string;
  sectionPaddingClass: string;
}

const DEFAULT_PROFILE: ViewportProfile = {
  width: 1280,
  height: 800,
  aspectRatio: 1.6,
  orientation: "landscape",
  deviceClass: "desktop",
  isTouchDevice: false,
  isMobileViewport: false,
  containerClass: "max-w-[1360px]",
  heroHeadingClass: "text-4xl sm:text-5xl xl:text-6xl",
  sectionPaddingClass: "px-4 sm:px-6 lg:px-8",
};

function computeProfile(): ViewportProfile {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE;
  }

  const width = window.innerWidth;
  const height = Math.max(window.innerHeight, 1);
  const aspectRatio = Number((width / height).toFixed(2));
  const orientation: AspectOrientation =
    aspectRatio < 0.92 ? "portrait" : aspectRatio <= 1.15 ? "square" : "landscape";

  const isMobileUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent || ""
  );
  const isCoarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const isTouchDevice = isMobileUa || isCoarsePointer;

  let deviceClass: DeviceClass = "desktop";
  if (width < 768 || (isTouchDevice && orientation === "portrait" && width < 1024)) {
    deviceClass = "mobile";
  } else if (width < 1180 || (isTouchDevice && width < 1280)) {
    deviceClass = "tablet";
  } else if (width >= 1680 || aspectRatio >= 2.0) {
    deviceClass = "ultrawide";
  }

  const containerClass =
    deviceClass === "ultrawide"
      ? "max-w-[1620px]"
      : deviceClass === "desktop"
      ? "max-w-[1360px]"
      : deviceClass === "tablet"
      ? "max-w-[980px]"
      : "max-w-[540px]";

  const heroHeadingClass =
    deviceClass === "mobile"
      ? width < 380
        ? "text-[28px]"
        : "text-[34px]"
      : deviceClass === "tablet"
      ? "text-4xl sm:text-5xl"
      : deviceClass === "ultrawide"
      ? "text-5xl xl:text-[64px]"
      : "text-4xl sm:text-5xl xl:text-6xl";

  const sectionPaddingClass =
    deviceClass === "mobile"
      ? "px-3.5"
      : deviceClass === "tablet"
      ? "px-5 sm:px-6"
      : "px-4 sm:px-6 lg:px-8";

  return {
    width,
    height,
    aspectRatio,
    orientation,
    deviceClass,
    isTouchDevice,
    isMobileViewport: deviceClass === "mobile",
    containerClass,
    heroHeadingClass,
    sectionPaddingClass,
  };
}

export function useViewportProfile(): ViewportProfile {
  const [profile, setProfile] = useState<ViewportProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    const sync = () => setProfile(computeProfile());
    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);

  return profile;
}
