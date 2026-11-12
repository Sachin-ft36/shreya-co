export interface PincodeLookupResult {
  valid: boolean;
  city: string;
  state: string;
  etaDays: number;
  etaLabel: string;
  serviceNote: string;
}

const PIN_PREFIX_MAP: Array<{ prefix: string; city: string; state: string; etaDays: number }> = [
  { prefix: '211', city: 'Prayagraj', state: 'Uttar Pradesh', etaDays: 2 },
  { prefix: '400', city: 'Mumbai', state: 'Maharashtra', etaDays: 2 },
  { prefix: '401', city: 'Thane / Palghar', state: 'Maharashtra', etaDays: 2 },
  { prefix: '411', city: 'Pune', state: 'Maharashtra', etaDays: 3 },
  { prefix: '410', city: 'Navi Mumbai', state: 'Maharashtra', etaDays: 2 },
  { prefix: '302', city: 'Jaipur', state: 'Rajasthan', etaDays: 2 },
  { prefix: '313', city: 'Udaipur', state: 'Rajasthan', etaDays: 3 },
  { prefix: '110', city: 'New Delhi', state: 'Delhi NCR', etaDays: 3 },
  { prefix: '122', city: 'Gurugram', state: 'Haryana', etaDays: 3 },
  { prefix: '201', city: 'Noida', state: 'Uttar Pradesh', etaDays: 3 },
  { prefix: '560', city: 'Bengaluru', state: 'Karnataka', etaDays: 3 },
  { prefix: '500', city: 'Hyderabad', state: 'Telangana', etaDays: 3 },
  { prefix: '600', city: 'Chennai', state: 'Tamil Nadu', etaDays: 3 },
  { prefix: '700', city: 'Kolkata', state: 'West Bengal', etaDays: 4 },
  { prefix: '380', city: 'Ahmedabad', state: 'Gujarat', etaDays: 3 },
  { prefix: '395', city: 'Surat', state: 'Gujarat', etaDays: 3 },
  { prefix: '160', city: 'Chandigarh', state: 'Chandigarh', etaDays: 4 },
  { prefix: '226', city: 'Lucknow', state: 'Uttar Pradesh', etaDays: 4 },
  { prefix: '462', city: 'Bhopal', state: 'Madhya Pradesh', etaDays: 4 },
  { prefix: '452', city: 'Indore', state: 'Madhya Pradesh', etaDays: 4 },
  { prefix: '682', city: 'Kochi', state: 'Kerala', etaDays: 4 },
  { prefix: '800', city: 'Patna', state: 'Bihar', etaDays: 4 },
  { prefix: '751', city: 'Bhubaneswar', state: 'Odisha', etaDays: 4 },
  { prefix: '781', city: 'Guwahati', state: 'Assam', etaDays: 5 }
];

/** Formats an estimated Pan-India vault delivery date N business days ahead. */
export function getEstimatedDeliveryLabel(etaDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + etaDays);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/** Validates a 6-digit Indian PIN code and estimates insured transit hub & ETA. */
export function lookupIndianPincode(rawPin: string): PincodeLookupResult {
  const cleaned = rawPin.replace(/\D/g, '');
  if (!/^[1-8]\d{5}$/.test(cleaned)) {
    return {
      valid: false,
      city: '',
      state: '',
      etaDays: 4,
      etaLabel: '',
      serviceNote: 'Enter a valid 6-digit Indian PIN code (e.g. 400001).'
    };
  }

  const matched = PIN_PREFIX_MAP.find((entry) => cleaned.startsWith(entry.prefix));
  const etaDays = matched ? matched.etaDays : 4;
  const city = matched ? matched.city : 'Pan-India Serviceable Zone';
  const state = matched ? matched.state : 'India';

  return {
    valid: true,
    city,
    state,
    etaDays,
    etaLabel: getEstimatedDeliveryLabel(etaDays),
    serviceNote:
      etaDays <= 2
        ? 'Priority Atelier Vault Courier · Next/2-Day Insured Handover'
        : 'Insured Pan-India Vault Transit · Free Shipping & OTP Handover'
  };
}

/** Evaluates supported privilege/promo codes and returns discount percentage. */
export function resolvePromoDiscount(code: string): { valid: boolean; pct: number; normalized: string } {
  const normalized = code.trim().toUpperCase();
  if (normalized === 'ATELIER10' || normalized === 'SHREYA10') {
    return { valid: true, pct: 10, normalized };
  }
  if (normalized === 'WELCOME5') {
    return { valid: true, pct: 5, normalized };
  }
  return { valid: false, pct: 0, normalized };
}

