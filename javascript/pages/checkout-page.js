import { prefersReducedMotion } from "../core/browser.js";
import { clearCart, getCartDetails, getCartTotals } from "../services/cart-service.js";
import { createOrderHistoryEntry, saveOrderHistoryEntry } from "../services/history-service.js";
import { renderCheckoutSummary } from "../ui/renderers.js";
import { updateCartBadge } from "../ui/site-chrome.js";

export function initCheckoutPage({ pageUrl }) {
  const form = document.getElementById("checkout-form");
  const summaryRoot = document.getElementById("checkout-summary");
  const emptyState = document.getElementById("checkout-empty");
  const successRoot = document.getElementById("checkout-success");

  if (!form || !summaryRoot || !emptyState || !successRoot) {
    return;
  }

  const cartDetails = getCartDetails();
  const totals = getCartTotals();

  if (cartDetails.length === 0) {
    form.classList.add("is-hidden");
    emptyState.classList.remove("is-hidden");
    summaryRoot.innerHTML = renderCheckoutSummary(totals, false);
    return;
  }

  summaryRoot.innerHTML = renderCheckoutSummary(totals, true);

  const fields = Array.from(form.querySelectorAll("input[required]"));
  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => clearFieldError(field));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalidFields = fields.filter((field) => !validateField(field));
    if (invalidFields.length > 0) {
      invalidFields[0].focus();
      return;
    }

    const createdAt = Date.now();
    const orderCode = `OMT-${createdAt.toString().slice(-6)}`;
    saveOrderHistoryEntry(createOrderHistoryEntry(orderCode, createdAt, cartDetails, totals));
    clearCart();
    updateCartBadge();
    form.classList.add("is-hidden");
    summaryRoot.innerHTML = renderCheckoutSummary(getCartTotals(), false);
    successRoot.classList.remove("is-hidden");
    successRoot.innerHTML = `
      <h2>Pedido registrado</h2>
      <p>Tu pedido fue registrado con el código <strong>${orderCode}</strong>.</p>
      <p>Ya puedes revisar esta compra en tu historial o volver al catálogo para seguir comprando.</p>
      <div class="success-actions">
        <a class="button button-secondary" href="${pageUrl("history")}">Ver historial</a>
        <a class="button button-primary" href="${pageUrl("catalog")}">Volver al catálogo</a>
      </div>
    `;
    form.reset();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  });
}

function validateField(field) {
  const value = field.value.trim();
  let message = "";

  if (!value) {
    message = "Este campo es obligatorio.";
  } else if (field.type === "email" && !isValidEmail(value)) {
    message = "Ingresa un correo válido.";
  } else if (field.name === "phone" && value.replace(/\D/g, "").length < 7) {
    message = "Ingresa un teléfono válido.";
  }

  if (message) {
    setFieldError(field, message);
    return false;
  }

  clearFieldError(field);
  return true;
}

function setFieldError(field, message) {
  field.setAttribute("aria-invalid", "true");
  const error = document.querySelector(`[data-error-for="${field.id}"]`);
  if (error) {
    error.textContent = message;
  }
}

function clearFieldError(field) {
  field.removeAttribute("aria-invalid");
  const error = document.querySelector(`[data-error-for="${field.id}"]`);
  if (error) {
    error.textContent = "";
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
