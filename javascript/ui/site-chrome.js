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
          <button
            class="menu-toggle"
            type="button"
            aria-expanded="false"
            aria-controls="site-nav-panel"
            aria-label="Abrir menú de navegación"
            data-menu-toggle
          >
            <span class="menu-toggle-icon" aria-hidden="true">
              <span class="menu-toggle-bar"></span>
              <span class="menu-toggle-bar"></span>
              <span class="menu-toggle-bar"></span>
            </span>
          </button>
          <nav id="site-nav-panel" class="site-nav" aria-label="Navegación principal">
            <div class="site-nav-panel">
              <div class="site-nav-copy">
                <p class="site-nav-kicker">Menú</p>
                <h2 class="site-nav-title">Explora OmarTech Market</h2>
                <p class="site-nav-note">Accede rápido a las secciones principales desde este panel central.</p>
              </div>
              <div class="site-nav-links">
                ${renderNavLink("home", "Inicio", page, pageUrl)}
                ${renderNavLink("catalog", "Catálogo", page, pageUrl)}
                ${renderNavLink("history", "Historial", page, pageUrl)}
                ${renderCartLink(page, pageUrl)}
              </div>
            </div>
          </nav>
        </div>
      </div>
    `;

    setupHeaderMenu(header);
    syncHeaderOffset(header);
    window.addEventListener("resize", () => syncHeaderOffset(header));
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

function setupHeaderMenu(header) {
  const toggle = header.querySelector("[data-menu-toggle]");
  const nav = header.querySelector(".site-nav");
  const desktopQuery = window.matchMedia("(min-width: 769px)");
  const body = document.body;

  if (!toggle || !nav) {
    return;
  }

  const openMenu = () => {
    header.classList.add("is-menu-open");
    body.classList.add("is-menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menú de navegación");
  };

  const closeMenu = () => {
    header.classList.remove("is-menu-open");
    body.classList.remove("is-menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú de navegación");
  };

  const syncMenuState = () => {
    if (desktopQuery.matches) {
      header.classList.remove("is-menu-open");
      body.classList.remove("is-menu-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú de navegación");
      return;
    }

    if (!header.classList.contains("is-menu-open")) {
      body.classList.remove("is-menu-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú de navegación");
    }
  };

  toggle.addEventListener("click", () => {
    if (header.classList.contains("is-menu-open")) {
      closeMenu();
      return;
    }

    openMenu();
  });

  nav.addEventListener("click", (event) => {
    const target = event.target;
    const link = target instanceof Element ? target.closest("a") : null;

    if (link && !desktopQuery.matches) {
      closeMenu();
      return;
    }

    if (target === nav && !desktopQuery.matches) {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (desktopQuery.matches || !header.classList.contains("is-menu-open")) {
      return;
    }

    if (!header.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("is-menu-open")) {
      closeMenu();
      toggle.focus();
    }
  });

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", syncMenuState);
  } else if (typeof desktopQuery.addListener === "function") {
    desktopQuery.addListener(syncMenuState);
  }

  syncMenuState();
}

function syncHeaderOffset(header) {
  const root = document.documentElement;
  const offset = header.offsetHeight || 0;
  root.style.setProperty("--header-offset", `${offset}px`);
}
