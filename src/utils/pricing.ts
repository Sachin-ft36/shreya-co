import React from 'react';
import { CURRENCY_CONFIG, METAL_OPTIONS } from '../data/catalog';
import { CurrencyCode, MetalFinish } from '../types/storefront';

/** Calculate metal-adjusted INR valuation rounded to nearest rupee. */
export function getAdjustedPriceInr(basePriceInr: number, metal: MetalFinish): number {
  const found = METAL_OPTIONS.find((m) => m.name === metal);
  return Math.round(basePriceInr * (found ? found.multiplier : 1));
}

/** Format an INR valuation in the selected display currency using locale conventions. */
export function formatPrice(inrAmount: number, currency: CurrencyCode): string {
  const cfg = CURRENCY_CONFIG[currency];
  const converted = Math.round(inrAmount * cfg.rate);
  if (currency === 'INR') {
    return `${cfg.symbol}${converted.toLocaleString('en-IN')}`;
  }
  return `${cfg.symbol}${converted.toLocaleString('en-US')}`;
}

/** Architectural SVG placeholder rendered if remote imagery fails to load. */
export const FALLBACK_PLATE_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750"><rect width="600" height="750" fill="#ECD8D6"/><rect x="40" y="40" width="520" height="670" fill="none" stroke="#D9A79C" stroke-opacity="0.45" stroke-width="1"/><circle cx="300" cy="360" r="96" fill="none" stroke="#2B1C1E" stroke-opacity="0.25" stroke-width="1.5"/><circle cx="300" cy="360" r="68" fill="none" stroke="#D9A79C" stroke-opacity="0.55" stroke-width="1"/><text x="300" y="510" text-anchor="middle" font-family="Georgia, serif" font-size="18" letter-spacing="6" fill="#2B1C1E" fill-opacity="0.55">SHREYA &amp; CO.</text></svg>`
  );

/** Guard image load errors once with an editorial plate placeholder. */
export function handleImgError(e: React.SyntheticEvent<HTMLImageElement>): void {
  const img = e.currentTarget;
  if (img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = '1';
  img.src = FALLBACK_PLATE_SVG;
}

