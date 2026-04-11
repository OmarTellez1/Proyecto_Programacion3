export function getPageContext() {
  return {
    page: document.body.dataset.page,
    rootPrefix: document.body.dataset.root || "."
  };
}

export function createPageUrlBuilder(rootPrefix) {
  const routes = {
    home: `${rootPrefix}/index.html`,
    catalog: `${rootPrefix}/structure/catalog.html`,
    product: `${rootPrefix}/structure/product.html`,
    cart: `${rootPrefix}/structure/cart.html`,
    checkout: `${rootPrefix}/structure/checkout.html`,
    history: `${rootPrefix}/structure/history.html`
  };

  return function pageUrl(targetPage, params = {}) {
    const baseUrl = routes[targetPage];
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.set(key, String(value));
      }
    });

    return `${baseUrl}${query.toString() ? `?${query.toString()}` : ""}`;
  };
}
