import { getCartItemsCount } from "../services/cart-service.js";

export function renderSiteChrome({ page, pageUrl }) {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");

  if (header) {
    header.innerHTML = `
      <div class="header-shell">
        <div class="header-row">
          <div class="brand" translate="no" aria-label="Marca del sitio">
            <span class="brand-kicker">Tech Store</span>
            <span class="brand-name">OmarTech Market</span>
          </div>
          <nav class="site-nav" aria-label="Navegación principal">
            ${renderNavLink("home", "Home", page, pageUrl)}
            ${renderNavLink("catalog", "Catálogo", page, pageUrl)}
            ${renderNavLink("history", "Historial", page, pageUrl)}
            ${renderCartLink(page, pageUrl)}
          </nav>
        </div>
      </div>
    `;
  }

  if (footer) {
    footer.innerHTML = `
      <div class="footer-panel">
        <p class="footer-signature" translate="no">OmarTech Market © 2026</p>
      </div>
    `;
  }
}

export function updateCartBadge() {
  const itemsCount = getCartItemsCount();
  document.querySelectorAll("[data-cart-badge]").forEach((badge) => {
    badge.textContent = String(itemsCount);
  });
}

function renderNavLink(targetPage, label, currentPage, pageUrl) {
  const active = currentPage === targetPage || (targetPage === "catalog" && currentPage === "product") ? "is-active" : "";
  return `<a class="nav-link ${active}" href="${pageUrl(targetPage)}">${label}</a>`;
}

function renderCartLink(currentPage, pageUrl) {
  const active = currentPage === "cart" || currentPage === "checkout" ? "is-active" : "";
  return `<a class="cart-link ${active}" href="${pageUrl("cart")}">Carrito <span class="cart-badge" data-cart-badge>0</span></a>`;
}
