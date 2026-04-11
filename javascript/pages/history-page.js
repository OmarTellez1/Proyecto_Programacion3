import { getOrderHistory, getOrderHistoryMetrics } from "../services/history-service.js";
import { renderHistoryOrder, renderHistorySummary } from "../ui/renderers.js";

export function initHistoryPage({ pageUrl }) {
  const ordersRoot = document.getElementById("history-orders");
  const summaryRoot = document.getElementById("history-summary");
  const emptyState = document.getElementById("history-empty");

  if (!ordersRoot || !summaryRoot || !emptyState) {
    return;
  }

  const orders = getOrderHistory();
  const metrics = getOrderHistoryMetrics(orders);

  summaryRoot.innerHTML = renderHistorySummary(metrics, orders.length > 0, pageUrl);

  if (orders.length === 0) {
    ordersRoot.innerHTML = "";
    emptyState.classList.remove("is-hidden");
    return;
  }

  emptyState.classList.add("is-hidden");
  ordersRoot.innerHTML = orders.map((order) => renderHistoryOrder(order)).join("");
}
