import type { ExtractColorsOptions, ExtractedColors } from "./types";
import { loadImageToCanvas } from "./browser/loadImage";
import { samplePixels } from "./core/samplePixels";
import { pickSemanticColors } from "./core/pickSemanticColors";

export async function extractColors(
  image: string | HTMLImageElement,
  options: ExtractColorsOptions = {}
): Promise<ExtractedColors> {
  const {
    sampleSize = 64,
    mode = "default",
    crossOrigin = "anonymous"
  } = options;

  // 1. Load image & draw to canvas
  const canvas = await loadImageToCanvas(image, crossOrigin);

  // 2. Sample pixels (fast)
  const pixels = samplePixels(canvas, sampleSize);

  // 3. Pick semantic colors
  const colors = pickSemanticColors(pixels, mode);

  return colors;
}
