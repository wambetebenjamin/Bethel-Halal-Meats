export type CategorySlug =
  | "beef"
  | "goat"
  | "chicken"
  | "lamb"
  | "offal"
  | "sausages";

export type Category = {
  slug: CategorySlug;
  name: string;
  blurb: string;
  image: string;
  imageAlt: string;
};

export type WeightOption = {
  label: string;
  grams: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  cutType: "steak" | "roast" | "ribs" | "cubes" | "minced" | "whole" | "portions" | "organ" | "sausage";
  pricePerKg: number;
  weights: WeightOption[];
  image: string;
  imageAlt: string;
  gallery: { src: string; alt: string }[];
  shortDescription: string;
  description: string;
  origin: string;
  fatContent: string;
  cooking: string[];
  bestSeller?: boolean;
  badge?: string;
};

const STANDARD_WEIGHTS: WeightOption[] = [
  { label: "500g", grams: 500 },
  { label: "1kg", grams: 1000 },
  { label: "2kg", grams: 2000 },
  { label: "5kg", grams: 5000 },
];

export const CATEGORIES: Category[] = [
  {
    slug: "beef",
    name: "Beef",
    blurb: "Ribeye, sirloin, spareribs and stewing cuts from grass fed cattle.",
    image: "/images/beef-steak-board.jpg",
    imageAlt: "Seasoned raw beef steak resting on a wooden chopping board",
  },
  {
    slug: "goat",
    name: "Goat",
    blurb: "Shoulder, leg and ribs, cut fresh for nyama choma and stews.",
    image: "/images/goat-cuts.jpg",
    imageAlt: "Assorted raw goat cuts arranged on a wooden board",
  },
  {
    slug: "chicken",
    name: "Chicken",
    blurb: "Whole birds, breasts and thighs, chilled and never frozen twice.",
    image: "/images/chicken-whole.jpg",
    imageAlt: "Whole raw chicken on a wooden board with herbs",
  },
  {
    slug: "lamb",
    name: "Lamb",
    blurb: "Chops and shoulder with a fine grain and clean, mild flavour.",
    image: "/images/lamb-chops.jpg",
    imageAlt: "Close up of raw lamb chops showing marbling",
  },
  {
    slug: "offal",
    name: "Offal",
    blurb: "Liver, kidney and tripe, cleaned and prepared the same morning.",
    image: "/images/offal-livers.jpg",
    imageAlt: "Fresh liver and organ cuts hanging at a butchery display",
  },
  {
    slug: "sausages",
    name: "Sausages",
    blurb: "Beef and chicken sausages made in house with natural casings.",
    image: "/images/sausages.jpg",
    imageAlt: "Raw sausages arranged on a wooden chopping board",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "bh-beef-ribeye",
    slug: "beef-ribeye",
    name: "Beef Ribeye",
    category: "beef",
    cutType: "steak",
    pricePerKg: 1600,
    weights: STANDARD_WEIGHTS,
    image: "/images/beef-steak-board.jpg",
    imageAlt: "Raw ribeye steak seasoned with salt on a wooden board",
    gallery: [
      { src: "/images/beef-steak-board.jpg", alt: "Raw ribeye steak on a wooden board" },
      { src: "/images/beef-marbled.jpg", alt: "Close view of marbled beef" },
      { src: "/images/meat-board.jpg", alt: "Beef cuts resting on a board" },
    ],
    shortDescription: "Well marbled, hand trimmed, ready for the grill or pan.",
    description:
      "Cut from the upper rib section of grass fed cattle, this ribeye carries a generous seam of fat through the centre that keeps it juicy at high heat. Our butchers trim the outer cap, leave a thin fat layer and cut steaks to your chosen weight on the day of delivery.",
    origin: "Grass fed cattle raised in Laikipia County, slaughtered at a licensed halal abattoir in Athi River.",
    fatContent: "Moderate to high, roughly 12 percent intramuscular fat.",
    cooking: [
      "Season with salt 40 minutes before cooking and pat dry.",
      "Sear in a heavy pan for 2 to 3 minutes per side for medium rare.",
      "Rest for 5 minutes before slicing against the grain.",
    ],
    bestSeller: true,
    badge: "Best seller",
  },
  {
    id: "bh-beef-sirloin",
    slug: "beef-sirloin",
    name: "Beef Sirloin",
    category: "beef",
    cutType: "steak",
    pricePerKg: 1450,
    weights: STANDARD_WEIGHTS,
    image: "/images/beef-marbled.jpg",
    imageAlt: "Thick cut raw beef sirloin with a fine fat cap",
    gallery: [
      { src: "/images/beef-marbled.jpg", alt: "Raw beef sirloin close up" },
      { src: "/images/beef-steak-board.jpg", alt: "Beef steak on a chopping board" },
    ],
    shortDescription: "A lean, firm steak with a thin cap of fat.",
    description:
      "Sirloin is cut from the short loin, behind the ribs. It is leaner than ribeye with a firmer bite, which makes it a dependable choice for a weeknight dinner or a weekend braai. We cut it to order and leave the fat cap on for flavour.",
    origin: "Grass fed cattle raised in Kajiado County, halal slaughtered in Athi River.",
    fatContent: "Low to moderate, roughly 7 percent intramuscular fat.",
    cooking: [
      "Bring to room temperature for 20 minutes before cooking.",
      "Grill over medium high heat for 3 minutes per side.",
      "Slice thinly and finish with a squeeze of lemon.",
    ],
  },
  {
    id: "bh-beef-spareribs",
    slug: "beef-spareribs",
    name: "Beef Spareribs",
    category: "beef",
    cutType: "ribs",
    pricePerKg: 850,
    weights: STANDARD_WEIGHTS,
    image: "/images/beef-spareribs.jpg",
    imageAlt: "Rack of raw beef spareribs on a board",
    gallery: [
      { src: "/images/beef-spareribs.jpg", alt: "Raw rack of beef spareribs" },
      { src: "/images/meat-board.jpg", alt: "Beef cuts on a wooden board" },
    ],
    shortDescription: "Meaty ribs for slow roasting, smoking or boiling.",
    description:
      "Our spareribs are cut from the belly side of the rib cage with a good layer of meat left on the bone. They reward slow cooking, whether you roast them low, smoke them or simmer them for a stew. Ask for a full rack or a cut portion.",
    origin: "Local grass fed cattle, halal slaughtered in Athi River.",
    fatContent: "Moderate, with fat rendering slowly along the bone.",
    cooking: [
      "Rub with spices and rest overnight in the fridge.",
      "Roast covered at 150 degrees Celsius for 2 hours.",
      "Finish uncovered for 15 minutes to caramelise the surface.",
    ],
  },
  {
    id: "bh-beef-stew",
    slug: "beef-stew-cubes",
    name: "Beef Stew Cubes",
    category: "beef",
    cutType: "cubes",
    pricePerKg: 780,
    weights: STANDARD_WEIGHTS,
    image: "/images/beef-cubes.jpg",
    imageAlt: "Beef stew cubes on a white tray",
    gallery: [
      { src: "/images/beef-cubes.jpg", alt: "Beef stew cubes ready for cooking" },
      { src: "/images/meat-board.jpg", alt: "Beef pieces on a wooden board" },
    ],
    shortDescription: "Hand cut cubes from the chuck and blade.",
    description:
      "Chuck and blade are cut into even cubes roughly 3 centimetres across so they cook at the same rate. The connective tissue breaks down into a rich, glossy sauce, which makes this our most ordered cut for pilau, stew and curry.",
    origin: "Local grass fed cattle, halal slaughtered in Athi River.",
    fatContent: "Moderate, with natural marbling through the muscle.",
    cooking: [
      "Brown the cubes in batches before adding liquid.",
      "Simmer gently for 90 minutes until the meat pulls apart.",
      "Add potatoes in the last 25 minutes of cooking.",
    ],
    bestSeller: true,
  },
  {
    id: "bh-beef-mince",
    slug: "beef-mince",
    name: "Minced Beef",
    category: "beef",
    cutType: "minced",
    pricePerKg: 720,
    weights: STANDARD_WEIGHTS,
    image: "/images/meat-board.jpg",
    imageAlt: "Freshly minced beef on a board",
    gallery: [
      { src: "/images/meat-board.jpg", alt: "Beef cuts resting on a butcher's board" },
      { src: "/images/beef-cubes.jpg", alt: "Sliced beef on a white tray" },
    ],
    shortDescription: "Coarse ground beef with a clean 85 percent lean ratio.",
    description:
      "We grind fresh to order from chuck and trim, leaving a coarse texture that holds together in burgers and fills out sauces without turning pasty. No fillers, no preservatives and no offcuts from other days.",
    origin: "Local grass fed cattle, halal slaughtered in Athi River.",
    fatContent: "Roughly 15 percent fat for a juicy crumb.",
    cooking: [
      "Brown without stirring for the first 3 minutes.",
      "Break up with a spoon and season after the water cooks off.",
      "Use within 24 hours or freeze on the day of delivery.",
    ],
  },
  {
    id: "bh-goat-shoulder",
    slug: "goat-shoulder",
    name: "Goat Shoulder",
    category: "goat",
    cutType: "cubes",
    pricePerKg: 950,
    weights: STANDARD_WEIGHTS,
    image: "/images/goat-cuts.jpg",
    imageAlt: "Raw goat shoulder pieces on a wooden board",
    gallery: [
      { src: "/images/goat-cuts.jpg", alt: "Goat cuts on a chopping board" },
      { src: "/images/butcher-hanging.jpg", alt: "Carcasses hanging at the butchery" },
    ],
    shortDescription: "Bone in shoulder cut for nyama choma and slow stews.",
    description:
      "Shoulder carries the sweetest meat on the goat and enough fat to stay tender over charcoal. We cut it into chunks with the bone in unless you ask us to bone it out. This is the cut most of our customers order for a weekend choma.",
    origin: "Goats sourced from Kitui and Machakos, halal slaughtered in Nairobi.",
    fatContent: "Moderate, with fat concentrated around the bone.",
    cooking: [
      "Marinate with garlic, ginger and lemon for 4 hours.",
      "Grill over medium charcoal for 25 minutes, turning often.",
      "For a stew, simmer for 2 hours with tomatoes and cumin.",
    ],
    bestSeller: true,
    badge: "Best seller",
  },
  {
    id: "bh-goat-ribs",
    slug: "goat-ribs",
    name: "Goat Ribs",
    category: "goat",
    cutType: "ribs",
    pricePerKg: 900,
    weights: STANDARD_WEIGHTS,
    image: "/images/meat-board.jpg",
    imageAlt: "Goat ribs arranged on a wooden board",
    gallery: [
      { src: "/images/meat-board.jpg", alt: "Assorted cuts on a chopping board" },
      { src: "/images/goat-cuts.jpg", alt: "Assorted goat cuts" },
    ],
    shortDescription: "Thin, flavourful ribs that cook quickly over coals.",
    description:
      "Goat ribs are leaner and thinner than beef ribs, so they take less time on the grill. We cut them into manageable pieces and trim the excess fat so they char rather than smoke. Ask for a rack or a mixed bag of ribs and shoulder.",
    origin: "Goats sourced from Kitui and Machakos, halal slaughtered in Nairobi.",
    fatContent: "Low, with a thin fat layer over the bone.",
    cooking: [
      "Boil for 15 minutes with salt and ginger to tenderise.",
      "Finish on the grill for 10 minutes, brushing with marinade.",
      "Rest under foil for 5 minutes before serving.",
    ],
  },
  {
    id: "bh-goat-leg",
    slug: "goat-leg",
    name: "Goat Leg",
    category: "goat",
    cutType: "roast",
    pricePerKg: 1050,
    weights: STANDARD_WEIGHTS,
    image: "/images/butcher-hanging.jpg",
    imageAlt: "Fresh goat and beef carcasses hanging in a butchery",
    gallery: [
      { src: "/images/butcher-hanging.jpg", alt: "Carcasses hanging at the butchery" },
      { src: "/images/goat-cuts.jpg", alt: "Goat cuts on a wooden board" },
    ],
    shortDescription: "Whole leg, boned or bone in, for a celebration roast.",
    description:
      "A whole goat leg feeds eight to ten people and suits a celebration table. Our butcher can bone it, tie it into a neat roast or cut it into two smaller joints. Tell us which you prefer in the special instructions at checkout.",
    origin: "Goats sourced from Kitui and Machakos, halal slaughtered in Nairobi.",
    fatContent: "Low, with a thin covering of fat.",
    cooking: [
      "Score the surface and push garlic and rosemary into the cuts.",
      "Roast at 160 degrees Celsius for 2 hours, basting every 30 minutes.",
      "Rest for 15 minutes before carving.",
    ],
  },
  {
    id: "bh-chicken-whole",
    slug: "whole-chicken",
    name: "Whole Chicken",
    category: "chicken",
    cutType: "whole",
    pricePerKg: 620,
    weights: STANDARD_WEIGHTS,
    image: "/images/chicken-whole.jpg",
    imageAlt: "Whole raw chicken on a wooden board with rosemary",
    gallery: [
      { src: "/images/chicken-whole.jpg", alt: "Whole raw chicken on a board" },
      { src: "/images/chicken-portions.jpg", alt: "Fresh chicken on a slate board" },
    ],
    shortDescription: "Farm fresh whole bird, cleaned and trussed.",
    description:
      "Our whole chickens come from farms in Kiambu and Thika and are slaughtered to halal standard each morning. Each bird is cleaned, singed and trussed, ready for the oven or the grill. Ask for it spatchcocked at no extra charge.",
    origin: "Free range farms in Kiambu and Thika counties.",
    fatContent: "Low, mostly in the skin.",
    cooking: [
      "Pat the skin dry and season inside and out.",
      "Roast at 200 degrees Celsius for 70 minutes.",
      "Check the thickest part of the thigh reaches 75 degrees Celsius.",
    ],
    bestSeller: true,
  },
  {
    id: "bh-chicken-breast",
    slug: "chicken-breast",
    name: "Chicken Breast Fillets",
    category: "chicken",
    cutType: "portions",
    pricePerKg: 900,
    weights: STANDARD_WEIGHTS,
    image: "/images/chicken-portions.jpg",
    imageAlt: "Raw chicken breast fillets on a wooden board",
    gallery: [
      { src: "/images/chicken-portions.jpg", alt: "Fresh chicken on a slate board" },
      { src: "/images/chicken-whole.jpg", alt: "Whole chicken on a board" },
    ],
    shortDescription: "Skinless breast fillets, trimmed and portioned.",
    description:
      "Each breast is boned, skinned and trimmed of sinew, then packed flat so it thaws evenly. They are ideal for quick grills, stir fries and meal prep. We can butterfly or cube them on request.",
    origin: "Free range farms in Kiambu and Thika counties.",
    fatContent: "Very low, under 3 percent fat.",
    cooking: [
      "Pound to an even thickness for quick cooking.",
      "Grill for 4 minutes per side and avoid overcooking.",
      "Rest under foil for 3 minutes before slicing.",
    ],
  },
  {
    id: "bh-chicken-thighs",
    slug: "chicken-thighs",
    name: "Chicken Thighs",
    category: "chicken",
    cutType: "portions",
    pricePerKg: 750,
    weights: STANDARD_WEIGHTS,
    image: "/images/chicken-portions.jpg",
    imageAlt: "Chicken thighs on a chopping board",
    gallery: [
      { src: "/images/chicken-portions.jpg", alt: "Fresh chicken ready for cutting" },
      { src: "/images/chicken-whole.jpg", alt: "Whole chicken" },
    ],
    shortDescription: "Bone in thighs with skin on for roasting.",
    description:
      "Bone in thighs stay juicy when roasted or braised and cost less than breast. We trim the excess fat and leave the skin on, which crisps nicely in a hot oven. Order them whole or ask us to cut them into smaller pieces for a curry.",
    origin: "Free range farms in Kiambu and Thika counties.",
    fatContent: "Moderate, mostly under the skin.",
    cooking: [
      "Season with paprika, garlic and salt.",
      "Roast skin side up at 210 degrees Celsius for 40 minutes.",
      "Finish under the grill for 5 minutes for crisp skin.",
    ],
  },
  {
    id: "bh-lamb-chops",
    slug: "lamb-chops",
    name: "Lamb Chops",
    category: "lamb",
    cutType: "ribs",
    pricePerKg: 1700,
    weights: STANDARD_WEIGHTS,
    image: "/images/lamb-chops.jpg",
    imageAlt: "Close up of raw lamb chops with fine marbling",
    gallery: [
      { src: "/images/lamb-chops.jpg", alt: "Raw lamb chops close up" },
      { src: "/images/butcher-hanging.jpg", alt: "Carcasses hanging in the butchery" },
    ],
    shortDescription: "French trimmed chops cut from the best end.",
    description:
      "These chops come from the best end of the neck, French trimmed so the bone is clean and the eye of meat sits proud. The grain is fine and the flavour is mild, which makes them a favourite for a quick grill or a special dinner.",
    origin: "Lamb raised in Naivasha and Nyandarua, halal slaughtered in Nairobi.",
    fatContent: "Moderate, with a fine seam of fat along the edge.",
    cooking: [
      "Season simply with salt, pepper and rosemary.",
      "Grill for 3 minutes per side for pink meat.",
      "Rest for 4 minutes before serving.",
    ],
    bestSeller: true,
    badge: "Best seller",
  },
  {
    id: "bh-lamb-shoulder",
    slug: "lamb-shoulder",
    name: "Lamb Shoulder",
    category: "lamb",
    cutType: "roast",
    pricePerKg: 1300,
    weights: STANDARD_WEIGHTS,
    image: "/images/butcher-hanging.jpg",
    imageAlt: "Fresh carcasses hanging at a butchery",
    gallery: [
      { src: "/images/butcher-hanging.jpg", alt: "Carcasses hanging in the butchery" },
      { src: "/images/lamb-chops.jpg", alt: "Lamb chops close up" },
    ],
    shortDescription: "Bone in shoulder for a slow roast.",
    description:
      "Shoulder is the most forgiving cut of lamb. Cooked slowly it becomes spoon tender, and the bone keeps the meat moist. We prepare it as a whole shoulder or in two pieces, depending on the size of your pot.",
    origin: "Lamb raised in Naivasha and Nyandarua, halal slaughtered in Nairobi.",
    fatContent: "Moderate to high, marbled through the muscle.",
    cooking: [
      "Rub with cumin, coriander and oil the night before.",
      "Cover and roast at 150 degrees Celsius for 3 hours.",
      "Shred with two forks and serve with rice or chapati.",
    ],
  },
  {
    id: "bh-beef-liver",
    slug: "beef-liver",
    name: "Beef Liver",
    category: "offal",
    cutType: "organ",
    pricePerKg: 550,
    weights: STANDARD_WEIGHTS,
    image: "/images/offal-livers.jpg",
    imageAlt: "Fresh liver hanging at a butchery display",
    gallery: [
      { src: "/images/offal-livers.jpg", alt: "Fresh liver at the butchery" },
      { src: "/images/meat-board.jpg", alt: "Meat cuts on a board" },
    ],
    shortDescription: "Sliced fresh liver, cleaned and trimmed.",
    description:
      "Liver is cleaned, trimmed of membrane and sliced to your preferred thickness. It is a good source of iron and cooks in minutes. Ask for it sliced thin for a quick fry or thick for a wet fry with onions.",
    origin: "Local grass fed cattle, halal slaughtered in Athi River.",
    fatContent: "Low, under 5 percent fat.",
    cooking: [
      "Soak in milk for 15 minutes to soften the flavour.",
      "Fry with onions and garlic for 4 minutes per side.",
      "Do not overcook, as liver turns grainy when dry.",
    ],
  },
  {
    id: "bh-goat-kidney",
    slug: "goat-kidney",
    name: "Goat Kidney",
    category: "offal",
    cutType: "organ",
    pricePerKg: 600,
    weights: STANDARD_WEIGHTS,
    image: "/images/offal-livers.jpg",
    imageAlt: "Fresh organ cuts at a butchery",
    gallery: [
      { src: "/images/offal-livers.jpg", alt: "Organ cuts hanging at the butchery" },
      { src: "/images/goat-cuts.jpg", alt: "Goat cuts on a board" },
    ],
    shortDescription: "Cleaned kidneys, halved and ready to cook.",
    description:
      "Kidneys are cleaned, halved and soaked, so there is no prep left for you at home. They are a traditional addition to pilau and wet fry. Cook them quickly over high heat so they stay tender.",
    origin: "Goats sourced from Kitui and Machakos, halal slaughtered in Nairobi.",
    fatContent: "Very low.",
    cooking: [
      "Soak in salted water for 20 minutes and drain.",
      "Sear over high heat for 3 minutes.",
      "Finish with onions, tomato and a little chilli.",
    ],
  },
  {
    id: "bh-beef-tripe",
    slug: "beef-tripe",
    name: "Beef Tripe",
    category: "offal",
    cutType: "organ",
    pricePerKg: 450,
    weights: STANDARD_WEIGHTS,
    image: "/images/meat-board.jpg",
    imageAlt: "Prepared beef tripe on a board",
    gallery: [
      { src: "/images/meat-board.jpg", alt: "Assorted cuts on a chopping board" },
      { src: "/images/offal-livers.jpg", alt: "Organ cuts at the butchery" },
    ],
    shortDescription: "Cleaned and pre boiled tripe for matumbo.",
    description:
      "Tripe is cleaned and pre boiled for two hours, which removes the strong smell and shortens your cooking time. Cut it into strips or leave it in sheets. It is the base of a proper matumbo wet fry.",
    origin: "Local grass fed cattle, halal slaughtered in Athi River.",
    fatContent: "Very low.",
    cooking: [
      "Rinse well and cut into strips.",
      "Simmer with salt until tender, about 45 minutes.",
      "Fry with onions, tomatoes and coriander.",
    ],
  },
  {
    id: "bh-beef-sausages",
    slug: "beef-sausages",
    name: "Beef Sausages",
    category: "sausages",
    cutType: "sausage",
    pricePerKg: 800,
    weights: STANDARD_WEIGHTS,
    image: "/images/sausages.jpg",
    imageAlt: "Fresh beef sausages on a wooden board",
    gallery: [
      { src: "/images/sausages.jpg", alt: "Raw beef sausages on a board" },
      { src: "/images/meat-board.jpg", alt: "Meat cuts on a board" },
    ],
    shortDescription: "House made beef sausages in natural casings.",
    description:
      "We grind beef shoulder with our own spice blend, add a little ice to keep the texture smooth and link the sausages in natural casings. There are no fillers and no artificial colour. They are ideal for breakfast, a barbecue or a quick dinner.",
    origin: "Made in house from local halal beef.",
    fatContent: "Roughly 20 percent fat for a juicy bite.",
    cooking: [
      "Prick the casings lightly and cook over medium heat.",
      "Pan fry for 12 minutes, turning to brown all sides.",
      "Or bake at 190 degrees Celsius for 20 minutes.",
    ],
  },
  {
    id: "bh-chicken-sausages",
    slug: "chicken-sausages",
    name: "Chicken Sausages",
    category: "sausages",
    cutType: "sausage",
    pricePerKg: 850,
    weights: STANDARD_WEIGHTS,
    image: "/images/sausages.jpg",
    imageAlt: "Fresh chicken sausages on a chopping board",
    gallery: [
      { src: "/images/sausages.jpg", alt: "Raw sausages on a wooden board" },
      { src: "/images/chicken-portions.jpg", alt: "Fresh chicken ready for cutting" },
    ],
    shortDescription: "Lean chicken sausages with herbs and black pepper.",
    description:
      "Made from chicken thigh for flavour and breast for leanness, these sausages are lighter than our beef version. We season them with thyme, black pepper and a little garlic. A good choice for breakfast or for children.",
    origin: "Made in house from free range chicken.",
    fatContent: "Low, roughly 10 percent fat.",
    cooking: [
      "Cook gently, as lean sausages brown quickly.",
      "Pan fry for 10 minutes over medium low heat.",
      "Serve with eggs or in a chapati wrap.",
    ],
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: CategorySlug) {
  return PRODUCTS.filter((product) => product.category === category);
}

export function getBestSellers() {
  return PRODUCTS.filter((product) => product.bestSeller);
}

export function getRelatedProducts(product: Product, limit = 4) {
  const sameCategory = PRODUCTS.filter(
    (item) => item.category === product.category && item.id !== product.id,
  );
  const others = PRODUCTS.filter(
    (item) => item.category !== product.category && item.id !== product.id,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function categoryLabel(category: CategorySlug) {
  return CATEGORIES.find((item) => item.slug === category)?.name ?? category;
}

export const CUT_TYPES = [
  { value: "steak", label: "Steak" },
  { value: "roast", label: "Roast" },
  { value: "ribs", label: "Ribs" },
  { value: "cubes", label: "Cubes" },
  { value: "minced", label: "Minced" },
  { value: "whole", label: "Whole" },
  { value: "portions", label: "Portions" },
  { value: "organ", label: "Organ" },
  { value: "sausage", label: "Sausage" },
] as const;

export const WEIGHT_RANGES = [
  { value: "under-1kg", label: "Under 1kg", min: 0, max: 999 },
  { value: "1kg-2kg", label: "1kg to 2kg", min: 1000, max: 2000 },
  { value: "2kg-5kg", label: "2kg to 5kg", min: 2000, max: 5000 },
  { value: "over-5kg", label: "Over 5kg", min: 5000, max: 100000 },
] as const;
