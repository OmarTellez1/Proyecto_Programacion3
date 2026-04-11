import { clampCartQuantity } from "../core/normalizers.js";
import { addToCart } from "../services/cart-service.js";
import { getProductById } from "../services/product-service.js";
import { renderNotFoundState, renderProductDetail } from "../ui/renderers.js";
import { updateCartBadge } from "../ui/site-chrome.js";

export function initProductPage({ pageUrl }) {
  const detailRoot = document.getElementById("product-detail");
  if (!detailRoot) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const product = productId ? getProductById(productId) : null;

  if (!product) {
    detailRoot.innerHTML = renderNotFoundState(pageUrl);
    return;
  }

  detailRoot.innerHTML = renderProductDetail(product);

  const quantityInput = document.getElementById("product-quantity");
  const addButton = document.getElementById("add-to-cart");
  const feedback = document.getElementById("product-cart-feedback");
  const decreaseButton = document.querySelector("[data-quantity-action='decrease']");
  const increaseButton = document.querySelector("[data-quantity-action='increase']");

  if (!quantityInput || !addButton || !feedback || !decreaseButton || !increaseButton) {
    return;
  }

  const syncQuantity = () => {
    quantityInput.value = String(clampCartQuantity(quantityInput.value));
  };

  decreaseButton.addEventListener("click", () => {
    syncQuantity();
    quantityInput.value = String(Math.max(1, Number.parseInt(quantityInput.value, 10) - 1));
  });

  increaseButton.addEventListener("click", () => {
    syncQuantity();
    quantityInput.value = String(Math.min(9, Number.parseInt(quantityInput.value, 10) + 1));
  });

  quantityInput.addEventListener("change", syncQuantity);

  addButton.addEventListener("click", () => {
    syncQuantity();
    addToCart(product.id, Number.parseInt(quantityInput.value, 10));
    updateCartBadge();
    feedback.textContent = "Producto agregado al carrito.";
  });
}
