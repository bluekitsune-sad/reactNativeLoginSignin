/**
 * Mock merchant menus for the menu/product list and item detail screens
 * (SCREEN_INVENTORY 24–25, PRD 5.4). Sections and items per merchant;
 * prices are plain numbers in the mall currency (PKR) and formatted with
 * `formatPrice`. `available: false` renders a sold-out chip. Pure
 * presentation — no cart, checkout or nutrition logic (ordering and
 * payments are blocked on business decisions).
 */
export const MOCK_MENUS = {
  "lucky-m-1": {
    sections: [
      {
        id: "lucky-m-1-s1",
        title: "Lunch combos",
        items: [
          {
            id: "lucky-m-1-i1",
            name: "Chicken karahi combo",
            description: "Half karahi, naan, raita and a soft drink.",
            price: 890,
            tags: ["Spicy", "Combo"],
            available: true,
          },
          {
            id: "lucky-m-1-i2",
            name: "Daal chawal plate",
            description: "Yellow daal, steamed rice, salad and pickle.",
            price: 450,
            tags: ["Veg"],
            available: true,
          },
          {
            id: "lucky-m-1-i3",
            name: "Seekh kebab platter",
            description: "Four kebabs with chutney and onion rings.",
            price: 620,
            tags: ["Spicy"],
            available: false,
          },
        ],
      },
      {
        id: "lucky-m-1-s2",
        title: "Beverages",
        items: [
          {
            id: "lucky-m-1-i4",
            name: "Sweet lassi",
            description: "Chilled yoghurt lassi, 300 ml.",
            price: 180,
            tags: [],
            available: true,
          },
          {
            id: "lucky-m-1-i5",
            name: "Mint margarita",
            description: "Fresh mint lemonade, 350 ml.",
            price: 220,
            tags: [],
            available: true,
          },
        ],
      },
    ],
  },
  "lucky-m-2": {
    sections: [
      {
        id: "lucky-m-2-s1",
        title: "Noodles & rice",
        items: [
          {
            id: "lucky-m-2-i1",
            name: "Chilli garlic noodles",
            description: "Wok-tossed noodles with chilli garlic sauce.",
            price: 520,
            tags: ["Spicy"],
            available: true,
          },
          {
            id: "lucky-m-2-i2",
            name: "Chicken fried rice",
            description: "Egg fried rice with shredded chicken.",
            price: 480,
            tags: [],
            available: true,
          },
        ],
      },
    ],
  },
  "lucky-m-7": {
    sections: [
      {
        id: "lucky-m-7-s1",
        title: "Burgers",
        items: [
          {
            id: "lucky-m-7-i1",
            name: "Classic smash burger",
            description: "Double patty, cheddar, pickles and house sauce.",
            price: 560,
            tags: ["Popular"],
            available: true,
          },
          {
            id: "lucky-m-7-i2",
            name: "Crispy zinger burger",
            description: "Crispy chicken fillet with slaw.",
            price: 490,
            tags: [],
            available: true,
          },
        ],
      },
      {
        id: "lucky-m-7-s2",
        title: "Sides",
        items: [
          {
            id: "lucky-m-7-i3",
            name: "Loaded fries",
            description: "Fries with cheese sauce and jalapeños.",
            price: 320,
            tags: ["Spicy"],
            available: true,
          },
        ],
      },
    ],
  },
  "lucky-m-9": {
    sections: [
      {
        id: "lucky-m-9-s1",
        title: "Chai & coffee",
        items: [
          {
            id: "lucky-m-9-i1",
            name: "Karak chai",
            description: "Strong milk tea, small cup.",
            price: 120,
            tags: [],
            available: true,
          },
          {
            id: "lucky-m-9-i2",
            name: "Doodh patti",
            description: "Slow-boiled full-cream chai.",
            price: 150,
            tags: [],
            available: true,
          },
          {
            id: "lucky-m-9-i3",
            name: "Cold coffee",
            description: "Blended iced coffee with cream.",
            price: 280,
            tags: [],
            available: true,
          },
        ],
      },
    ],
  },
};

/**
 * Format a price in the mall currency. Uses manual grouping so it works
 * identically across JS engines; pair with tabular-nums text styles.
 */
export const formatPrice = (amount) => {
  const value = Number.isFinite(amount) ? Math.max(0, Math.trunc(amount)) : 0;
  const grouped = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `PKR ${grouped}`;
};

export const getMenuForMerchant = (merchantId) => MOCK_MENUS[merchantId] || null;

export const getMenuItemById = (merchantId, itemId) => {
  const menu = MOCK_MENUS[merchantId];
  if (!menu) {
    return null;
  }
  for (const section of menu.sections || []) {
    const item = (section.items || []).find((candidate) => candidate.id === itemId);
    if (item) {
      return { item, section };
    }
  }
  return null;
};
