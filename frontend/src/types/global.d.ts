declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      src?: string;
      poster?: string;
      alt?: string;
      ar?: boolean | "";
      arModes?: string;
      cameraControls?: boolean | "";
      autoRotate?: boolean | "";
      exposure?: number | string;
      environmentImage?: string;
      shadowIntensity?: number | string;
      reveal?: "auto" | "interaction" | "manual";
      // Add any other attributes you use
    };
  }
}
