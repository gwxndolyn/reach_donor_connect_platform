// @ts-nocheck
"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type Props = {
  url: string; // initial GLB/GLTF
  poster?: string;
  alt?: string;
  className?: string; // applied to the <model-viewer/>
  loadingSpriteSrc?: string; // optional: show this image while loading
};

// What the parent can call on the ref
export type GLBViewerHandle = {
  load: (url: string) => Promise<void>; // load a new model URL
  refresh: () => Promise<void>; // force-reload current model
};

const GLBViewer = forwardRef<GLBViewerHandle, Props>(function GLBViewer(
  { url, poster, alt = "3D model", className, loadingSpriteSrc }: Props,
  ref
) {
  const elRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
    if (!el || !url) return;
    setIsLoaded(Boolean(el.loaded)); // if it’s already loaded (e.g., hot reload)
    el.src = url;
  }, [url]);

  // Wire load + error logs and set loaded state
  useEffect(() => {
    const el = elRef.current as any;
    if (!el) return;

    const onLoad = () => {
      setIsLoaded(true);
      // console.log("model-viewer loaded");
    };
    const onError = (e: Event) => {
      setIsLoaded(true); // stop showing spinner even on error
      console.error("model-viewer error", e);
    };

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
        setIsLoaded(false);
        el.src = newUrl;
        try {
          // If updateComplete exists, await it; we still rely on 'load' to flip isLoaded
          if (el.updateComplete) await el.updateComplete;
        } catch {}
      },

      // Force refresh the current model (even if URL is the same)
      refresh: async () => {
        const el = elRef.current;
        if (!el) return;
        setIsLoaded(false);
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
    <div
      className="relative bg-slate-50 dark:bg-zinc-900 rounded-xl"
      style={{
        width: "100%",
        height: 500,
        borderRadius: 12,
      }}
      aria-busy={!isLoaded}
    >
      <model-viewer
        ref={elRef}
        poster={poster}
        alt={alt}
        class={[
          "w-full h-full rounded-xl bg-slate-50 dark:bg-zinc-900",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        loading="lazy"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 12,
          background: "#f8fafc",
        }}
        ar
        ar-modes="webxr scene-viewer quick-look"
      />

      {/* Loading overlay while model-viewer.loaded === false */}
      {!isLoaded && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          {loadingSpriteSrc ? (
            <img
              src={loadingSpriteSrc}
              alt="Loading…"
              className="h-12 w-12 animate-pulse"
            />
          ) : (
            <svg
              className="h-6 w-6 animate-spin text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
        </div>
      )}
    </div>
  );
});

export default GLBViewer;
