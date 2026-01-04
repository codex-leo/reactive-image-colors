export async function loadImageToCanvas(
  image: string | HTMLImageElement,
  crossOrigin: "anonymous" | "use-credentials" = "anonymous"
): Promise<HTMLCanvasElement> {
  const img =
    typeof image === "string" ? await loadImageFromURL(image, crossOrigin) : image;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas not supported");
  }

  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvas;
}

function loadImageFromURL(
  src: string,
  crossOrigin: "anonymous" | "use-credentials"
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = crossOrigin;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}
