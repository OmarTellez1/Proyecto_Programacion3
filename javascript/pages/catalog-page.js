import { getProducts } from '../services/product-service.js';
import { addToCart } from '../services/cart-service.js';
import { renderProductCard } from '../ui/renderers.js';
import { categoryLabels } from '../core/constants.js';
import { updateCartBadge } from '../ui/site-chrome.js';

export function initCatalogPage({ pageUrl }) {
  const groupsRoot = document.getElementById('catalog-groups');
  if (!groupsRoot) {
    return;
  }

  const sections = buildCatalogSections(getProducts());
  groupsRoot.innerHTML =
    sections.length > 0
      ? sections.map((section) => renderCatalogSection(section, pageUrl)).join('')
      : renderEmptyCatalogState();

  bindQuickAddButtons(groupsRoot);
}

function buildCatalogSections(products) {
  const groupedProducts = products.reduce((map, product) => {
    const currentProducts = map.get(product.category) || [];
    currentProducts.push(product);
    map.set(product.category, currentProducts);
    return map;
  }, new Map());

  return Object.entries(categoryLabels)
    .map(([key, label]) => ({
      key,
      label,
      products: groupedProducts.get(key) || [],
    }))
    .filter((section) => section.products.length > 0);
}

function renderCatalogSection(section, pageUrl) {
  return `
    <section class="catalog-section" aria-labelledby="catalog-section-${section.key}">
      <div class="catalog-section-header">
        <p class="product-category">Categoría</p>
        <h2 id="catalog-section-${section.key}" class="catalog-section-title">${section.label}</h2>
      </div>
      <div class="catalog-section-grid">
        ${section.products.map((product) => renderProductCard(product, pageUrl)).join('')}
      </div>
    </section>
  `;
}

function renderEmptyCatalogState() {
  return `
    <div class="empty-state">
      <h2>Catálogo en preparación</h2>
      <p>Agrega productos a las categorías para mostrarlos en esta sección.</p>
    </div>
  `;
}

function bindQuickAddButtons(root) {
  root.querySelectorAll('[data-quick-add]').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-quick-add');
      const status = root.querySelector(`[data-card-status="${productId}"]`);

      if (!productId) {
        return;
      }

      addToCart(productId, 1);
      updateCartBadge();
      button.textContent = 'Added';

      if (status) {
        status.textContent = 'Producto agregado al carrito.';
      }

      window.setTimeout(() => {
        button.textContent = 'Comprar';
        if (status) {
          status.textContent = '';
        }
      }, 1400);
    });
  });
}
