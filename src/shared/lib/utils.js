import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Utility to prepend the public base path to a given path if needed
export function withBaseUrl(path) {
  // Try to get the base path from window.__PUBLIC_PATH__ or from the current location
  const base = window.__PUBLIC_PATH__ || (window.location.pathname.match(/^\/[^\/]+\//) || ['/'])[0];
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith(base)) return path;
  if (path.startsWith('/')) return base.replace(/\/$/, '') + path;
  return base.replace(/\/$/, '') + '/' + path;
}
