export type ExtractColorsOptions = {
  sampleSize?: number; // downscale size (default later)
  mode?: "default" | "music";
  crossOrigin?: "anonymous" | "use-credentials";
};

export type ExtractedColors = {
  accent: string;
  light: string;
  dark: string;
  palette: string[];
};
