/**
 * Brand and business constants for Bethel Halal Meats.
 * Colours are lifted from the uploaded MeatKing template (css/main.css):
 * #ed0121 red, #F0A830 amber, #212d39 charcoal, #fbfbfb light, #2e2e2e ink.
 */

export const SITE = {
  name: "Bethel Halal Meats",
  shortName: "Bethel",
  tagline: "Fresh. Halal. Delivered to your door.",
  description:
    "Halal butchery and same day meat delivery in Nairobi. Order beef, goat, chicken, lamb, offal and sausages by cut and weight.",
  serviceArea: "Nairobi, Kenya",
  whatsappNumber: "254112272061",
  whatsappDisplay: "+254 112 272 061",
  whatsappMessage:
    "Hello Bethel Halal Meats, I would like to place a meat order or ask about your cuts and delivery.",
  email: "orders@bethelhalalmeats.co.ke",
  hours: "Monday to Saturday, 6:30am to 8:00pm. Sunday, 8:00am to 4:00pm.",
  address: "Bethel Halal Butchery, Kangundo Road, Nairobi, Kenya",
  freeDeliveryThreshold: 5000,
} as const;

export const WHATSAPP_LINK = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
  SITE.whatsappMessage,
)}`;

export function whatsappLink(message?: string) {
  if (!message) return WHATSAPP_LINK;
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export type DeliveryZone = {
  slug: string;
  name: string;
  fee: number;
  eta: string;
  note: string;
};

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    slug: "westlands",
    name: "Westlands",
    fee: 250,
    eta: "60 to 90 minutes",
    note: "Parklands, Highridge, Riverside and Sarit area.",
  },
  {
    slug: "kasarani",
    name: "Kasarani",
    fee: 300,
    eta: "75 to 105 minutes",
    note: "Roysambu, Zimmerman and Mwiki Road.",
  },
  {
    slug: "kiambu-road",
    name: "Kiambu Road",
    fee: 350,
    eta: "80 to 120 minutes",
    note: "Ridgeways, Kiambu Road and Fourways.",
  },
  {
    slug: "thika-road",
    name: "Thika Road",
    fee: 300,
    eta: "75 to 110 minutes",
    note: "Kahawa, Githurai, Lumumba Drive and TRM.",
  },
  {
    slug: "langata",
    name: "Langata",
    fee: 350,
    eta: "80 to 120 minutes",
    note: "Karen, Hardy, Galleria and Bomas.",
  },
  {
    slug: "south-b",
    name: "South B",
    fee: 250,
    eta: "60 to 90 minutes",
    note: "South B, Mariakani and Plaza area.",
  },
  {
    slug: "south-c",
    name: "South C",
    fee: 250,
    eta: "60 to 90 minutes",
    note: "South C, Bellevue and Mugoya.",
  },
  {
    slug: "eastlands",
    name: "Eastlands",
    fee: 300,
    eta: "75 to 110 minutes",
    note: "Buruburu, Donholm, Umoja and Kayole.",
  },
];

export function findZone(slug: string) {
  return DELIVERY_ZONES.find((zone) => zone.slug === slug);
}

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/#our-halal-promise", label: "Halal promise" },
  { href: "/#delivery-zones", label: "Delivery" },
  { href: "/#custom-orders", label: "Bulk orders" },
  { href: "/account", label: "Account" },
];

export const FOOTER_CATEGORIES = [
  { href: "/shop?category=beef", label: "Beef" },
  { href: "/shop?category=goat", label: "Goat" },
  { href: "/shop?category=chicken", label: "Chicken" },
  { href: "/shop?category=lamb", label: "Lamb" },
  { href: "/shop?category=offal", label: "Offal" },
  { href: "/shop?category=sausages", label: "Sausages" },
];

export const LEGAL_LINKS = [
  { href: "/legal/privacy-policy", label: "Privacy policy" },
  { href: "/legal/terms", label: "Terms of service" },
  { href: "/legal/cookie-policy", label: "Cookie policy" },
];
