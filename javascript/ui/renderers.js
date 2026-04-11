import { categoryLabels } from "../core/constants.js";
import { formatOrderDate, formatPrice } from "../core/formatters.js";
import { getProductById } from "../services/product-service.js";

export function renderProductCard(product, pageUrl) {
  return `
    <article class="product-card">
      <a class="product-media" href="${pageUrl("product", { id: product.id })}">
        <img src="${product.image}" alt="${product.alt}" width="720" height="540" loading="lazy" decoding="async">
      </a>
      <div class="product-body">
        <div class="product-copy">
          <span class="product-category">${categoryLabels[product.category]}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        </div>
        <div class="price-row">
          <span class="price">${formatPrice(product.price)}</span>
          <span class="price-note">${product.specs[0]}</span>
        </div>
        <div class="product-actions">
          <a class="button button-secondary" href="${pageUrl("product", { id: product.id })}">Ver detalle</a>
          <button class="button button-primary" type="button" data-quick-add="${product.id}">Agregar</button>
        </div>
      </div>
    </article>
  `;
}

export function renderProductDetail(product) {
  return `
    <div class="page-heading">
      <p class="eyebrow">Explorar productos</p>
      <h1 class="page-title">${product.name}</h1>
      <p class="page-lead">${product.description}</p>
    </div>
    <div class="product-detail">
      <div class="product-gallery">
        <img src="${product.image}" alt="${product.alt}" width="720" height="540" loading="eager" decoding="async">
        <ul class="product-spec-list">
          ${product.specs.map((spec) => `<li>${spec}</li>`).join("")}
        </ul>
      </div>
      <div class="product-sidebar">
        <span class="product-category">${categoryLabels[product.category]}</span>
        <h1>${product.name}</h1>
        <p class="product-description">${product.description}</p>
        <div class="price">${formatPrice(product.price)}</div>
        <div class="quantity-row">
          <div class="quantity-control" aria-label="Seleccionar cantidad">
            <button class="quantity-button" type="button" data-quantity-action="decrease" aria-label="Disminuir cantidad">-</button>
            <input id="product-quantity" class="quantity-input" type="number" min="1" max="9" value="1" inputmode="numeric">
            <button class="quantity-button" type="button" data-quantity-action="increase" aria-label="Aumentar cantidad">+</button>
          </div>
          <button id="add-to-cart" class="button button-primary" type="button">Agregar al carrito</button>
        </div>
        <p id="product-cart-feedback" class="status-text" role="status" aria-live="polite"></p>
      </div>
    </div>
  `;
}

export function renderCartItem(item) {
  return `
    <article class="cart-item">
      <div class="cart-item-media">
        <img src="${item.image}" alt="${item.alt}" width="320" height="240" loading="lazy" decoding="async">
      </div>
      <div class="cart-item-body">
        <div>
          <span class="product-category">${categoryLabels[item.category]}</span>
          <h2>${item.name}</h2>
          <p class="product-meta">${item.specs.join(" · ")}</p>
        </div>
        <div class="cart-item-foot">
          <div class="quantity-row">
            <div class="quantity-control">
              <button class="quantity-button" type="button" data-cart-step="decrease" data-cart-target="${item.id}" aria-label="Reducir cantidad">-</button>
              <input class="quantity-input" type="number" min="1" max="9" value="${item.quantity}" data-cart-quantity="${item.id}" aria-label="Cantidad para ${item.name}">
              <button class="quantity-button" type="button" data-cart-step="increase" data-cart-target="${item.id}" aria-label="Aumentar cantidad">+</button>
            </div>
            <button class="remove-button" type="button" data-cart-remove="${item.id}">Eliminar</button>
          </div>
          <span class="price">${formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>
    </article>
  `;
}

export function renderCartSummary(totals, hasItems, pageUrl) {
  return `
    <h2>Resumen</h2>
    <div class="summary-line">
      <span>Productos</span>
      <strong>${totals.itemsCount}</strong>
    </div>
    <div class="summary-line">
      <span>Subtotal</span>
      <strong>${formatPrice(totals.subtotal)}</strong>
    </div>
    <div class="summary-line">
      <span>Envío</span>
      <strong>${formatPrice(totals.shipping)}</strong>
    </div>
    <div class="summary-line summary-total">
      <span>Total</span>
      <strong>${formatPrice(totals.total)}</strong>
    </div>
    <p>${hasItems ? "Continúa con la compra cuando tu selección esté lista." : "Todavía no has agregado productos."}</p>
    ${hasItems ? `<a class="button button-primary" href="${pageUrl("checkout")}">Continuar compra</a>` : `<a class="button button-secondary" href="${pageUrl("catalog")}">Ir al catálogo</a>`}
  `;
}

export function renderCheckoutSummary(totals, hasItems) {
  return `
    <h2>Resumen</h2>
    <div class="summary-line">
      <span>Productos</span>
      <strong>${totals.itemsCount}</strong>
    </div>
    <div class="summary-line">
      <span>Subtotal</span>
      <strong>${formatPrice(totals.subtotal)}</strong>
    </div>
    <div class="summary-line">
      <span>Envío</span>
      <strong>${formatPrice(totals.shipping)}</strong>
    </div>
    <div class="summary-line summary-total">
      <span>Total</span>
      <strong>${formatPrice(totals.total)}</strong>
    </div>
    <p>${hasItems ? "Verifica tus datos y registra el pedido." : "No hay productos activos en el carrito."}</p>
  `;
}

export function renderHistorySummary(metrics, hasOrders, pageUrl) {
  return `
    <h2>Resumen</h2>
    <div class="summary-line">
      <span>Pedidos</span>
      <strong>${metrics.ordersCount}</strong>
    </div>
    <div class="summary-line">
      <span>Productos</span>
      <strong>${metrics.itemsCount}</strong>
    </div>
    <div class="summary-line">
      <span>Total invertido</span>
      <strong>${formatPrice(metrics.totalSpent)}</strong>
    </div>
    <div class="summary-line summary-total">
      <span>Última compra</span>
      <strong>${metrics.lastOrderDate}</strong>
    </div>
    <p class="history-note">${hasOrders ? "El historial se guarda solo en el navegador actual y depende del localStorage disponible." : "Todavía no hay compras guardadas en el navegador actual."}</p>
    <a class="button ${hasOrders ? "button-secondary" : "button-primary"}" href="${pageUrl("catalog")}">Ir al catálogo</a>
  `;
}

export function renderHistoryOrder(order) {
  return `
    <article class="history-order">
      <div class="history-order-head">
        <div class="history-order-copy">
          <span class="product-category">Pedido ${order.code}</span>
          <h2>Compra registrada el ${formatOrderDate(order.createdAt)}</h2>
          <p class="product-meta">${order.totals.itemsCount} producto${order.totals.itemsCount === 1 ? "" : "s"} comprados en esta orden.</p>
        </div>
        <span class="history-total">${formatPrice(order.totals.total)}</span>
      </div>
      <div class="history-meta">
        <div class="history-meta-block">
          <span class="history-meta-label">Subtotal</span>
          <span class="history-meta-value">${formatPrice(order.totals.subtotal)}</span>
        </div>
        <div class="history-meta-block">
          <span class="history-meta-label">Envío</span>
          <span class="history-meta-value">${formatPrice(order.totals.shipping)}</span>
        </div>
        <div class="history-meta-block">
          <span class="history-meta-label">Items</span>
          <span class="history-meta-value">${order.totals.itemsCount}</span>
        </div>
      </div>
      <div class="history-item-list">
        ${order.items.map((item) => renderHistoryItem(item)).join("")}
      </div>
    </article>
  `;
}

export function renderNotFoundState(pageUrl) {
  return `
    <div class="empty-state">
      <h2>Producto no encontrado</h2>
      <p>El producto solicitado no existe dentro del catálogo actual.</p>
      <a class="button button-primary" href="${pageUrl("catalog")}">Volver al catálogo</a>
    </div>
  `;
}

function renderHistoryItem(item) {
  const product = getProductById(item.productId);
  const image = product ? product.image : createHistoryFallbackImage(item.name);
  const alt = product ? product.alt : `Imagen de ${item.name}`;
  const specs = product ? product.specs.join(" · ") : "Producto registrado en el historial local.";
  const categoryLabel = categoryLabels[item.category] || "Producto";

  return `
    <article class="history-item">
      <div class="history-item-media">
        <img src="${image}" alt="${alt}" width="112" height="84" loading="lazy" decoding="async">
      </div>
      <div class="history-item-copy">
        <span class="product-category">${categoryLabel}</span>
        <h3>${item.name}</h3>
        <p class="product-meta">${specs}</p>
      </div>
      <div class="history-item-price">
        <span class="history-item-qty">Cantidad: ${item.quantity}</span>
        <span class="price">${formatPrice(item.price * item.quantity)}</span>
      </div>
    </article>
  `;
}

function createHistoryFallbackImage(name) {
  const safeName = escapeSvgText(name.toUpperCase());
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240" fill="none">
      <rect width="320" height="240" rx="24" fill="#FFF8F0"/>
      <rect x="16" y="16" width="288" height="208" rx="18" fill="#FFFFFF" stroke="rgba(29,35,43,0.08)"/>
      <text x="30" y="72" fill="#66717D" font-family="Arial, sans-serif" font-size="16" letter-spacing="4">HISTORIAL</text>
      <text x="30" y="132" fill="#1D232B" font-family="Arial, sans-serif" font-size="22" font-weight="700">${safeName}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeSvgText(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
