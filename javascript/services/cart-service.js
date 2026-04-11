import { STORAGE_KEY } from "../core/constants.js";
import { clampCartQuantity } from "../core/normalizers.js";
import { getProductById } from "./product-service.js";

export function getCart() {
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw
      .map((item) => normalizeCartItem(item))
      .filter(Boolean);
  } catch (error) {
    return [];
  }
}

export function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.productId === productId);
  const quantity = clampCartQuantity(qty);

  if (existingItem) {
    existingItem.quantity = clampCartQuantity(existingItem.quantity + quantity);
  } else {
    cart.push({ productId, quantity });
  }

  saveCart(cart);
}

export function updateCartItem(productId, qty) {
  const cart = getCart();
  const item = cart.find((entry) => entry.productId === productId);

  if (!item) {
    return;
  }

  if (qty <= 0) {
    saveCart(cart.filter((entry) => entry.productId !== productId));
    return;
  }

  item.quantity = clampCartQuantity(qty);
  saveCart(cart);
}

export function removeCartItem(productId) {
  saveCart(getCart().filter((entry) => entry.productId !== productId));
}

export function getCartDetails() {
  return getCart()
    .map((item) => {
      const product = getProductById(item.productId);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter(Boolean);
}

export function getCartTotals() {
  const details = getCartDetails();
  const itemsCount = details.reduce((count, item) => count + item.quantity, 0);
  const subtotal = details.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 18;

  return {
    itemsCount,
    subtotal,
    shipping,
    total: subtotal + shipping
  };
}

export function getCartItemsCount() {
  return getCartTotals().itemsCount;
}

export function clearCart() {
  window.localStorage.removeItem(STORAGE_KEY);
}

function saveCart(cart) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function normalizeCartItem(item) {
  if (!item || typeof item.productId !== "string") {
    return null;
  }

  return {
    productId: item.productId,
    quantity: clampCartQuantity(item.quantity)
  };
}
