import { getPageContext, createPageUrlBuilder } from "./core/routing.js";
import { renderSiteChrome, updateCartBadge } from "./ui/site-chrome.js";
import { initHomePage } from "./pages/home-page.js";
import { initCatalogPage } from "./pages/catalog-page.js";
import { initProductPage } from "./pages/product-page.js";
import { initCartPage } from "./pages/cart-page.js";
import { initCheckoutPage } from "./pages/checkout-page.js";
import { initHistoryPage } from "./pages/history-page.js";
import { getProducts, getProductById } from "./services/product-service.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  getCartTotals
} from "./services/cart-service.js";
import { getOrderHistory } from "./services/history-service.js";

const { page, rootPrefix } = getPageContext();
const pageUrl = createPageUrlBuilder(rootPrefix);

renderSiteChrome({ page, pageUrl });
updateCartBadge();

const initializers = {
  home: initHomePage,
  catalog: initCatalogPage,
  product: initProductPage,
  cart: initCartPage,
  checkout: initCheckoutPage,
  history: initHistoryPage
};

initializers[page]?.({ pageUrl });

window.TechStoreApp = {
  getProducts,
  getProductById,
  getCart,
  getOrderHistory,
  addToCart,
  updateCartItem,
  removeCartItem,
  getCartTotals
};
