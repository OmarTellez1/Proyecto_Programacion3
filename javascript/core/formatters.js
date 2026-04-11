import { normalizeTimestamp } from "./normalizers.js";

const currencyFormatter = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD"
});

const dateTimeFormatter = new Intl.DateTimeFormat("es-EC", {
  dateStyle: "long",
  timeStyle: "short"
});

export function formatPrice(value) {
  return currencyFormatter.format(value);
}

export function formatOrderDate(value) {
  return dateTimeFormatter.format(new Date(normalizeTimestamp(value)));
}
