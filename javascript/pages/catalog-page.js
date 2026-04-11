import { categoryLabels } from "../core/constants.js";
import { getProducts } from "../services/product-service.js";
import { addToCart } from "../services/cart-service.js";
import { renderProductCard } from "../ui/renderers.js";
import { updateCartBadge } from "../ui/site-chrome.js";

export function initCatalogPage({ pageUrl }) {
  const searchInput = document.getElementById("catalog-search");
  const categorySelect = document.getElementById("catalog-category");
  const resultNote = document.getElementById("catalog-result-note");
  const gridRoot = document.getElementById("catalog-grid");
  const emptyState = document.getElementById("catalog-empty");
  const resetButton = document.getElementById("catalog-reset");

  if (!searchInput || !categorySelect || !resultNote || !gridRoot || !emptyState || !resetButton) {
    return;
  }

  populateCategorySelect(categorySelect);

  const params = new URLSearchParams(window.location.search);
  const state = {
    q: params.get("q") ? params.get("q").trim() : "",
    category: params.get("category") || "all"
  };

  searchInput.value = state.q;
  categorySelect.value = state.category;

  const render = () => {
    const products = filterProducts(state);
    gridRoot.innerHTML = products.map((product) => renderProductCard(product, pageUrl)).join("");
    gridRoot.classList.toggle("is-hidden", products.length === 0);
    emptyState.classList.toggle("is-hidden", products.length > 0);
    resultNote.textContent = buildCatalogMessage(products.length, state);
    syncCatalogQuery(state);
    bindQuickAddButtons(gridRoot);
  };

  searchInput.addEventListener("input", () => {
    state.q = searchInput.value.trim();
    render();
  });

  categorySelect.addEventListener("change", () => {
    state.category = categorySelect.value;
    render();
  });

  resetButton.addEventListener("click", () => {
    state.q = "";
    state.category = "all";
    searchInput.value = "";
    categorySelect.value = "all";
    render();
  });

  render();
}

function populateCategorySelect(select) {
  select.innerHTML = `
    <option value="all">Todas</option>
    ${Object.entries(categoryLabels).map(([key, label]) => `<option value="${key}">${label}</option>`).join("")}
  `;
}

function buildCatalogMessage(total, state) {
  const pieces = [`${total} producto${total === 1 ? "" : "s"}`];

  if (state.category !== "all") {
    pieces.push(`en ${categoryLabels[state.category]}`);
  }

  if (state.q) {
    pieces.push(`para "${state.q}"`);
  }

  return pieces.join(" ");
}

function syncCatalogQuery(state) {
  const params = new URLSearchParams();
  if (state.q) {
    params.set("q", state.q);
  }

  if (state.category !== "all") {
    params.set("category", state.category);
  }

  const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
  window.history.replaceState({}, "", nextUrl);
}

function filterProducts(filters) {
  const normalizedQuery = filters.q.toLowerCase();
  return getProducts().filter((product) => {
    const matchesCategory = filters.category === "all" || product.category === filters.category;
    const haystack = `${product.name} ${product.description} ${product.specs.join(" ")}`.toLowerCase();
    const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
}

function bindQuickAddButtons(root) {
  root.querySelectorAll("[data-quick-add]").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(button.getAttribute("data-quick-add"), 1);
      updateCartBadge();
      button.textContent = "Agregado";
      window.setTimeout(() => {
        button.textContent = "Agregar";
      }, 1200);
    });
  });
}
