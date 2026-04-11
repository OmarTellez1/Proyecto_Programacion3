import { categoryLabels, categoryThemes } from "../core/constants.js";

const rawProducts = [
  {
    id: "studiobook-pro-14",
    name: "StudioBook Pro 14",
    category: "laptops",
    price: 1499,
    specs: ["Intel Core Ultra 7", "32 GB RAM", "OLED 2.8K 120 Hz"],
    description: "Laptop compacta para estudio, diseño y trabajo diario.",
    featured: true
  },
  {
    id: "neonframe-16",
    name: "NeonFrame 16",
    category: "laptops",
    price: 1899,
    specs: ["RTX 4060", "16'' QHD+", "SSD 1 TB"],
    description: "Portátil potente para edición y tareas exigentes.",
    featured: true
  },
  {
    id: "pulse-75-wireless",
    name: "Pulse 75 Wireless",
    category: "keyboards",
    price: 129,
    specs: ["Formato 75%", "Hot-swap", "Bluetooth 5.1"],
    description: "Teclado mecánico limpio y compacto para escritorio.",
    featured: true
  },
  {
    id: "keystone-tkl",
    name: "Keystone TKL",
    category: "keyboards",
    price: 89,
    specs: ["Tenkeyless", "Switch táctil", "USB-C desmontable"],
    description: "Opción equilibrada para estudio y productividad.",
    featured: false
  },
  {
    id: "vector-air-mouse",
    name: "Vector Air Mouse",
    category: "mice",
    price: 69,
    specs: ["59 g", "Sensor 26000 DPI", "Batería 70 h"],
    description: "Mouse inalámbrico ligero y rápido.",
    featured: true
  },
  {
    id: "echo-one-headset",
    name: "Echo One Headset",
    category: "headphones",
    price: 159,
    specs: ["Cancelación híbrida", "Micrófono dual", "40 h de batería"],
    description: "Audífonos para concentración, llamadas y música.",
    featured: false
  },
  {
    id: "canvas-27-qhd",
    name: "Canvas 27 QHD",
    category: "monitors",
    price: 349,
    specs: ["27'' QHD", "USB-C 65 W", "sRGB 99%"],
    description: "Monitor versátil para multitarea y trabajo visual.",
    featured: true
  },
  {
    id: "panorama-34-ultrawide",
    name: "Panorama 34 Ultrawide",
    category: "monitors",
    price: 599,
    specs: ["34'' UWQHD", "144 Hz", "HDR400"],
    description: "Pantalla panorámica para una estación de trabajo completa.",
    featured: true
  }
];

const PRODUCTS = rawProducts.map((product) => ({
  ...product,
  alt: `Imagen de ${product.name}`,
  image: createProductImage(product)
}));

export function getProductCatalog() {
  return PRODUCTS;
}

function createProductImage(product) {
  const [primary, secondary] = categoryThemes[product.category] || ["#ff7a45", "#9fe0b1"];
  const titleLines = buildProductTitleLines(product.name.toUpperCase());
  const titleMarkup = titleLines
    .map((line, index) => `<text x="56" y="${176 + index * 48}" fill="#1D232B" font-family="Arial, sans-serif" font-size="44" font-weight="700">${escapeSvgText(line)}</text>`)
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="720" height="540" viewBox="0 0 720 540" fill="none">
      <defs>
        <linearGradient id="bg" x1="60" y1="40" x2="640" y2="520" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFF8F0"/>
          <stop offset="1" stop-color="#F3EBE1"/>
        </linearGradient>
        <linearGradient id="panel" x1="60" y1="80" x2="620" y2="470" gradientUnits="userSpaceOnUse">
          <stop stop-color="${primary}"/>
          <stop offset="1" stop-color="${secondary}"/>
        </linearGradient>
      </defs>
      <rect width="720" height="540" rx="36" fill="url(#bg)"/>
      <rect x="38" y="38" width="644" height="464" rx="28" fill="rgba(255,255,255,0.58)" stroke="rgba(29,35,43,0.08)"/>
      <circle cx="582" cy="144" r="92" fill="${primary}" fill-opacity="0.16"/>
      <circle cx="548" cy="366" r="118" fill="${secondary}" fill-opacity="0.14"/>
      <text x="56" y="92" fill="#66717D" font-family="Arial, sans-serif" font-size="18" letter-spacing="4">${escapeSvgText(categoryLabels[product.category].toUpperCase())}</text>
      ${titleMarkup}
      <text x="56" y="304" fill="#66717D" font-family="Arial, sans-serif" font-size="22">${escapeSvgText(product.specs[0])}</text>
      <rect x="56" y="350" width="220" height="110" rx="22" fill="url(#panel)"/>
      <text x="88" y="414" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="32" font-weight="700">${escapeSvgText(product.name.split(" ")[0].toUpperCase())}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildProductTitleLines(text) {
  if (!text.includes(" ")) {
    return [text];
  }

  const words = text.split(" ");
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= 14 || current.length === 0) {
      current = next;
      return;
    }

    lines.push(current);
    current = word;
  });

  if (current) {
    lines.push(current);
  }

  return lines.slice(0, 2);
}

function escapeSvgText(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
