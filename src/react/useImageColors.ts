import { useEffect, useState } from "react";
import { extractColors } from "../extractColors";
import type { ExtractColorsOptions, ExtractedColors } from "../types";

export function useImageColors(
  image: string | HTMLImageElement | null,
  options?: ExtractColorsOptions
) {
  const [colors, setColors] = useState<ExtractedColors | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!image) return;

    let cancelled = false;
    setLoading(true);

    extractColors(image, options)
      .then(result => {
        if (!cancelled) setColors(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [image]);

  return { colors, loading };
}
