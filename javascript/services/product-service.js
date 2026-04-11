import { getProductCatalog } from "../data/products.js";

const PRODUCTS = getProductCatalog();

export function getProducts() {
  return PRODUCTS.map((product) => ({
    ...product,
    specs: [...product.specs]
  }));
}

export function getProductById(id) {
  const product = PRODUCTS.find((entry) => entry.id === id);
  return product ? { ...product, specs: [...product.specs] } : null;
}
