export type RGB = {
  r: number;
  g: number;
  b: number;
};

export function samplePixels(
  canvas: HTMLCanvasElement,
  sampleSize: number = 64
): RGB[] {
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  // Downscale canvas
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = sampleSize;
  tempCanvas.height = sampleSize;

  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return [];

  tempCtx.drawImage(canvas, 0, 0, sampleSize, sampleSize);

  const { data } = tempCtx.getImageData(0, 0, sampleSize, sampleSize);

  const pixels: RGB[] = [];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent
    if (a < 125) continue;

    // Skip extreme black or white
    if (isExtreme(r, g, b)) continue;

    pixels.push({ r, g, b });
  }

  return pixels;
}

function isExtreme(r: number, g: number, b: number): boolean {
  const sum = r + g + b;

  // near black
  if (sum < 30) return true;

  // near white
  if (sum > 750) return true;

  return false;
}
