import type { RGB } from "./samplePixels";
import { rgbToHsl, rgbToHex } from "./colorUtils";

function isSkinTone(h: number, s: number, l: number) {
  return h > 10 && h < 45 && s < 0.6 && l > 0.3;
}

function accentScore(hsl: { h: number; s: number; l: number }) {
  const saturationScore = hsl.s;
  const contrastScore = 1 - Math.abs(hsl.l - 0.5);
  return saturationScore * 0.7 + contrastScore * 0.3;
}

export function pickSemanticColors(
  pixels: RGB[],
  mode: "default" | "music" = "default"
) {
  if (!pixels.length) {
    return {
      accent: "#000000",
      light: "#ffffff",
      dark: "#000000",
      palette: []
    };
  }

  const colors = pixels.map(rgb => {
    const hsl = rgbToHsl(rgb);
    return { rgb, hsl };
  });

  const accentCandidates = colors.filter(c =>
    c.hsl.s > 0.35 &&
    c.hsl.l > 0.25 &&
    c.hsl.l < 0.75 &&
    !isSkinTone(c.hsl.h, c.hsl.s, c.hsl.l)
  );

  const accent = accentCandidates
    .sort((a, b) => accentScore(b.hsl) - accentScore(a.hsl))[0];

  const light = colors
    .filter(c => c.hsl.l > 0.85)
    .sort((a, b) => b.hsl.l - a.hsl.l)[0];

  const dark = colors
    .filter(c => c.hsl.l < 0.2)
    .sort((a, b) => a.hsl.l - b.hsl.l)[0];

  const palette = colors
    .sort((a, b) => b.hsl.s - a.hsl.s)
    .slice(0, 6)
    .map(c => rgbToHex(c.rgb));

  return {
    accent: accent ? rgbToHex(accent.rgb) : palette[0],
    light: light ? rgbToHex(light.rgb) : "#ffffff",
    dark: dark ? rgbToHex(dark.rgb) : "#000000",
    palette
  };
}
