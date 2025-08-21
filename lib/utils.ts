import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOgImageUrl(title: string) {
  const baseUrl = "https://gxuvain.dev/api/og";
  const encodedTitle = encodeURIComponent(title);
  return `${baseUrl}?title=${encodedTitle}`;
}
