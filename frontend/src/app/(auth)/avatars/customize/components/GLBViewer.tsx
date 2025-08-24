"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

type Props = {
  url: string; // initial GLB/GLTF
  poster?: string;
  alt?: string;
  className?: string;
};

// What the parent can call on the ref
export type GLBViewerHandle = {
  load: (url: string) => Promise<void>; // load a new model URL
  refresh: () => Promise<void>; // force-reload current model
};

const GLBViewer = forwardRef<GLBViewerHandle, Props>(function GLBViewer(
  { url, poster, alt = "3D model", className }: Props,
  ref
) {
  const elRef = useRef<any>(null);

  // Register the custom element once
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!customElements.get("model-viewer")) {
      import("@google/model-viewer").catch((e) =>
        console.error("Failed to load @google/model-viewer", e)
      );
    }
  }, []);

  // Keep element's src in sync with the prop for initial render / prop updates.
  useEffect(() => {
    const el = elRef.current;
    if (el && url) {
      el.src = url;
    }
  }, [url]);

  // Wire load + error logs (optional)
  useEffect(() => {
    const el = elRef.current as HTMLElement | null;
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

  // Expose imperative API
  useImperativeHandle(
    ref,
    () => ({
      // Load a new URL
      load: async (newUrl: string) => {
        const el = elRef.current;
        if (!el) return;
        el.src = newUrl;
        // wait until model-viewer finishes updating (if available)
        try {
          if (el.updateComplete) await el.updateComplete;
        } catch {}
      },

      // Force refresh the current model (even if URL is the same)
      refresh: async () => {
        const el = elRef.current;
        if (!el) return;
        const cur = el.src || url;
        // cache-bust to force a re-fetch
        el.src = `${cur}${cur.includes("?") ? "&" : "?"}_=${Date.now()}`;
        try {
          if (el.updateComplete) await el.updateComplete;
        } catch {}
      },
    }),
    [url]
  );

  return (
    <model-viewer
      ref={elRef}
      poster={poster}
      alt={alt}
      class={className}
      camera-controls
      auto-rotate
      shadow-intensity="1"
      style={{
        width: "100%",
        height: 500,
        background: "#f8fafc",
        borderRadius: 12,
      }}
      ar
      ar-modes="webxr scene-viewer quick-look"
    />
  );
});

export default GLBViewer;
