import { HISTORY_STORAGE_KEY } from "../core/constants.js";
import { formatOrderDate } from "../core/formatters.js";
import {
  clampCartQuantity,
  clampNonNegativeInteger,
  sanitizePrice,
  normalizeTimestamp
} from "../core/normalizers.js";

export function getOrderHistory() {
  try {
    const raw = JSON.parse(window.localStorage.getItem(HISTORY_STORAGE_KEY) || "[]");
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw
      .map((entry) => normalizeOrderHistoryEntry(entry))
      .filter(Boolean)
      .sort((left, right) => right.createdAt - left.createdAt);
  } catch (error) {
    return [];
  }
}

export function saveOrderHistoryEntry(order) {
  const history = getOrderHistory();
  history.unshift(order);
  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
}

export function createOrderHistoryEntry(orderCode, createdAt, cartDetails, totals) {
  return {
    code: orderCode,
    createdAt,
    items: cartDetails.map((item) => ({
      productId: item.id,
      name: item.name,
      category: item.category,
      price: sanitizePrice(item.price),
      quantity: clampCartQuantity(item.quantity)
    })),
    totals: normalizeStoredTotals({
      itemsCount: totals.itemsCount,
      subtotal: totals.subtotal,
      shipping: totals.shipping
    })
  };
}

export function getOrderHistoryMetrics(orders) {
  const ordersCount = orders.length;
  const itemsCount = orders.reduce((sum, order) => sum + order.totals.itemsCount, 0);
  const totalSpent = orders.reduce((sum, order) => sum + order.totals.total, 0);
  const lastOrderDate = ordersCount > 0 ? formatOrderDate(orders[0].createdAt) : "Sin compras";

  return {
    ordersCount,
    itemsCount,
    totalSpent,
    lastOrderDate
  };
}

function normalizeOrderHistoryEntry(entry) {
  if (!entry || typeof entry.code !== "string") {
    return null;
  }

  const items = Array.isArray(entry.items)
    ? entry.items.map((item) => normalizeOrderHistoryItem(item)).filter(Boolean)
    : [];

  if (items.length === 0) {
    return null;
  }

  return {
    code: entry.code,
    createdAt: normalizeTimestamp(entry.createdAt),
    items,
    totals: normalizeStoredTotals(entry.totals, items)
  };
}

function normalizeOrderHistoryItem(item) {
  if (!item || typeof item.productId !== "string" || typeof item.name !== "string") {
    return null;
  }

  return {
    productId: item.productId,
    name: item.name,
    category: typeof item.category === "string" ? item.category : "",
    price: sanitizePrice(item.price),
    quantity: clampCartQuantity(item.quantity)
  };
}

function normalizeStoredTotals(totals, items = []) {
  const normalizedItems = Array.isArray(items) ? items : [];
  const subtotal = normalizedItems.length > 0
    ? normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : sanitizePrice(totals && totals.subtotal);
  const shipping = sanitizePrice(totals && totals.shipping);
  const itemsCount = normalizedItems.length > 0
    ? normalizedItems.reduce((sum, item) => sum + item.quantity, 0)
    : clampNonNegativeInteger(totals && totals.itemsCount);

  return {
    itemsCount,
    subtotal,
    shipping,
    total: subtotal + shipping
  };
}
