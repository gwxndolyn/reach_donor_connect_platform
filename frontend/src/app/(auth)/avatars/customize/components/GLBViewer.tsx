"use client";

import "@google/model-viewer";
import { useRef, useEffect } from "react";

type Props = {
  url: string; // GLB/GLTF URL (public, or signed)
  poster?: string; // optional poster image
  alt?: string; // accessibility text
  className?: string;
};

export default function GLBViewer({
  url,
  poster,
  alt = "3D model",
  className,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;

    const onLoad = () => console.log("model-viewer loaded");
    const onError = (e: Event) => console.error("model-viewer error", e);

    el.addEventListener("load", onLoad as any);
    el.addEventListener("error", onError as any);
    return () => {
      el.removeEventListener("load", onLoad as any);
      el.removeEventListener("error", onError as any);
    };
  }, []);

  return (
    <model-viewer
      ref={ref as any}
      src={url}
      poster={poster}
      alt={alt}
      camera-controls
      auto-rotate
      shadow-intensity="1"
      style={{
        width: "100%",
        height: 500,
        background: "#f8fafc",
        borderRadius: 12,
      }}
      // Optional AR:
      ar
      ar-modes="webxr scene-viewer quick-look"
      // Optional environment:
      // environment-image="neutral"
      // exposure="1"
    />
  );
}
