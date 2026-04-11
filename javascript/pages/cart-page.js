import {
  getCart,
  getCartDetails,
  getCartTotals,
  removeCartItem,
  updateCartItem
} from "../services/cart-service.js";
import { renderCartItem, renderCartSummary } from "../ui/renderers.js";
import { updateCartBadge } from "../ui/site-chrome.js";

export function initCartPage({ pageUrl }) {
  const itemsRoot = document.getElementById("cart-items");
  const summaryRoot = document.getElementById("cart-summary");
  const emptyState = document.getElementById("cart-empty");

  if (!itemsRoot || !summaryRoot || !emptyState) {
    return;
  }

  const render = () => {
    const cartDetails = getCartDetails();
    const totals = getCartTotals();

    emptyState.classList.toggle("is-hidden", cartDetails.length > 0);
    itemsRoot.classList.toggle("is-hidden", cartDetails.length === 0);

    if (cartDetails.length === 0) {
      itemsRoot.innerHTML = "";
      summaryRoot.innerHTML = renderCartSummary(totals, false, pageUrl);
      return;
    }

    itemsRoot.innerHTML = cartDetails.map((item) => renderCartItem(item)).join("");
    summaryRoot.innerHTML = renderCartSummary(totals, true, pageUrl);

    itemsRoot.querySelectorAll("[data-cart-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        removeCartItem(button.getAttribute("data-cart-remove"));
        updateCartBadge();
        render();
      });
    });

    itemsRoot.querySelectorAll("[data-cart-quantity]").forEach((input) => {
      input.addEventListener("change", () => {
        const productId = input.getAttribute("data-cart-quantity");
        const quantity = Number.parseInt(input.value, 10);
        updateCartItem(productId, Number.isNaN(quantity) ? 1 : quantity);
        updateCartBadge();
        render();
      });
    });

    itemsRoot.querySelectorAll("[data-cart-step]").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.getAttribute("data-cart-target");
        const direction = button.getAttribute("data-cart-step");
        const currentItem = getCart().find((entry) => entry.productId === productId);
        const currentQuantity = currentItem ? currentItem.quantity : 1;
        const nextQuantity = direction === "increase" ? currentQuantity + 1 : currentQuantity - 1;
        updateCartItem(productId, nextQuantity);
        updateCartBadge();
        render();
      });
    });
  };

  render();
}
