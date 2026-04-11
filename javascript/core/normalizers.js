export function clampCartQuantity(value) {
  const quantity = Number.parseInt(value, 10);
  if (Number.isNaN(quantity)) {
    return 1;
  }

  return Math.min(Math.max(quantity, 1), 9);
}

export function clampNonNegativeInteger(value) {
  const numericValue = Number.parseInt(value, 10);
  if (Number.isNaN(numericValue) || numericValue < 0) {
    return 0;
  }

  return numericValue;
}

export function sanitizePrice(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return 0;
  }

  return numericValue;
}

export function normalizeTimestamp(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return Date.now();
  }

  return numericValue;
}
