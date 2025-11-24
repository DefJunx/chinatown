import type { MenuCategory } from "@/types";

export const menuData: MenuCategory[] = [
  {
    name: "Antipasti",
    items: [
      {
        id: "ant-1",
        name: "Involtino Primavera",
        price: 2.0,
        category: "Antipasti",
      },
      {
        id: "ant-2",
        name: "Nuvolette di Gamberi",
        price: 2.0,
        category: "Antipasti",
      },
      {
        id: "ant-3",
        name: "Ravioli al vapore",
        price: 4.0,
        category: "Antipasti",
      },
      {
        id: "ant-4",
        name: "Ravioli alla griglia",
        price: 4.3,
        category: "Antipasti",
      },
      {
        id: "ant-5",
        name: "Ravioli con gamberi e carne",
        price: 4.3,
        category: "Antipasti",
      },
    ],
  },
  {
    name: "Primi Piatti",
    items: [
      {
        id: "pri-1",
        name: "Riso bianco",
        price: 2.5,
        category: "Primi Piatti",
      },
      {
        id: "pri-2",
        name: "Riso saltato alla cantonese",
        price: 4.0,
        category: "Primi Piatti",
      },
      {
        id: "pri-3",
        name: "Riso con gamberi",
        price: 4.5,
        category: "Primi Piatti",
      },
      {
        id: "pri-4",
        name: "Riso con verdure",
        price: 4.0,
        category: "Primi Piatti",
      },
      {
        id: "pri-5",
        name: "Riso al curry",
        price: 4.0,
        category: "Primi Piatti",
      },
      {
        id: "pri-6",
        name: "Gnocchi di riso con verdura",
        price: 4.8,
        category: "Primi Piatti",
      },
      {
        id: "pri-7",
        name: "Gnocchi di riso misto mare",
        price: 5.5,
        category: "Primi Piatti",
      },
      {
        id: "pri-8",
        name: "Gnocchi di riso misto carne",
        price: 5.5,
        category: "Primi Piatti",
      },
      {
        id: "pri-9",
        name: "Spaghetti di riso con verdure",
        price: 4.0,
        category: "Primi Piatti",
      },
      {
        id: "pri-10",
        name: "Spaghetti di riso misto mare",
        price: 5.5,
        category: "Primi Piatti",
      },
      {
        id: "pri-11",
        name: "Spaghetti di riso misto carne",
        price: 5.0,
        category: "Primi Piatti",
      },
      {
        id: "pri-12",
        name: "Spaghetti di soia con verdure (poco piccante)",
        price: 4.0,
        category: "Primi Piatti",
      },
      {
        id: "pri-13",
        name: "Spaghetti di soia con carne (poco piccante)",
        price: 5.0,
        category: "Primi Piatti",
      },
      {
        id: "pri-14",
        name: "Spaghetti di soia misto mare (poco piccante)",
        price: 5.5,
        category: "Primi Piatti",
      },
      {
        id: "pri-15",
        name: "Spaghetti di grano con verdure",
        price: 4.0,
        category: "Primi Piatti",
      },
      {
        id: "pri-16",
        name: "Spaghetti di grano misto mare",
        price: 5.5,
        category: "Primi Piatti",
      },
      {
        id: "pri-17",
        name: "Spaghetti di grano misto carne",
        price: 5.0,
        category: "Primi Piatti",
      },
    ],
  },
  {
    name: "Antipasti di pesce",
    items: [
      {
        id: "pes-1",
        name: "Calamari fritti",
        price: 6.0,
        category: "Antipasti di pesce",
      },
      {
        id: "pes-2",
        name: "Misto di mare saltato",
        price: 7.5,
        category: "Antipasti di pesce",
      },
      {
        id: "pes-3",
        name: "Misto di mare fritto",
        price: 7.5,
        category: "Antipasti di pesce",
      },
    ],
  },
  {
    name: "Gamberetti e gamberoni",
    items: [
      {
        id: "gam-1",
        name: "Gamberetti sale e pepe",
        price: 6.0,
        category: "Gamberetti e gamberoni",
      },
      {
        id: "gam-2",
        name: "Gamberetti fritti",
        price: 5.5,
        category: "Gamberetti e gamberoni",
      },
      {
        id: "gam-3",
        name: "Gamberetti misto verdura",
        price: 5.5,
        category: "Gamberetti e gamberoni",
      },
      {
        id: "gam-4",
        name: "Gamberetti fritti in salsa agrodolce",
        price: 5.5,
        category: "Gamberetti e gamberoni",
      },
      {
        id: "gam-5",
        name: "Gamberetti al curry",
        price: 5.5,
        category: "Gamberetti e gamberoni",
      },
      {
        id: "gam-6",
        name: "Gamberetti piccanti",
        price: 5.5,
        category: "Gamberetti e gamberoni",
      },
      {
        id: "gam-7",
        name: "Gamberetti con funghi e bambù",
        price: 5.5,
        category: "Gamberetti e gamberoni",
      },
      {
        id: "gam-8",
        name: "Gamberoni alla griglia",
        price: 7.0,
        category: "Gamberetti e gamberoni",
      },
      {
        id: "gam-9",
        name: "Gamberoni piccanti",
        price: 7.0,
        category: "Gamberetti e gamberoni",
      },
    ],
  },
  {
    name: "Pollo",
    items: [
      {
        id: "pol-1",
        name: "Pollo con gamberi e funghi",
        price: 5.5,
        category: "Pollo",
      },
      { id: "pol-2", name: "Pollo fritto", price: 5.0, category: "Pollo" },
      {
        id: "pol-3",
        name: "Pollo fritto al limone",
        price: 5.0,
        category: "Pollo",
      },
      {
        id: "pol-4",
        name: "Pollo fritto in salsa agrodolce",
        price: 5.0,
        category: "Pollo",
      },
      { id: "pol-5", name: "Pollo piccante", price: 5.0, category: "Pollo" },
      { id: "pol-6", name: "Pollo al curry", price: 5.0, category: "Pollo" },
      { id: "pol-7", name: "Pollo con sedano", price: 5.0, category: "Pollo" },
      { id: "pol-8", name: "Pollo con ananas", price: 5.0, category: "Pollo" },
      {
        id: "pol-9",
        name: "Pollo con mandorle",
        price: 5.5,
        category: "Pollo",
      },
      {
        id: "pol-10",
        name: "Pollo con funghi e bambù",
        price: 5.0,
        category: "Pollo",
      },
      {
        id: "pol-11",
        name: "Pollo con verdura",
        price: 5.0,
        category: "Pollo",
      },
      {
        id: "pol-12",
        name: "Pollo con zai zai",
        price: 5.0,
        category: "Pollo",
      },
      {
        id: "pol-13",
        name: "8 gioielli piccanti (pollo, manzo, maiale e gamberetti)",
        price: 7.0,
        category: "Pollo",
      },
    ],
  },
  {
    name: "Anatra",
    items: [
      { id: "ana-1", name: "Anatra arrosto", price: 7.0, category: "Anatra" },
      { id: "ana-2", name: "Anatra piccante", price: 7.0, category: "Anatra" },
      {
        id: "ana-3",
        name: "Anatra con ananas",
        price: 7.0,
        category: "Anatra",
      },
      {
        id: "ana-4",
        name: "Anatra in salsa agrodolce",
        price: 7.0,
        category: "Anatra",
      },
      {
        id: "ana-5",
        name: "Anatra con funghi e bambù",
        price: 7.0,
        category: "Anatra",
      },
    ],
  },
  {
    name: "Maiale",
    items: [
      { id: "mai-1", name: "Maiale piccante", price: 5.0, category: "Maiale" },
      {
        id: "mai-2",
        name: "Maiale fritto in salsa agrodolce",
        price: 5.0,
        category: "Maiale",
      },
      {
        id: "mai-3",
        name: "Maiale con verdure",
        price: 5.0,
        category: "Maiale",
      },
      {
        id: "mai-4",
        name: "Maiale con funghi e bambù",
        price: 5.0,
        category: "Maiale",
      },
      {
        id: "mai-5",
        name: "Maiale con zai zai",
        price: 5.0,
        category: "Maiale",
      },
    ],
  },
  {
    name: "Manzo",
    items: [
      { id: "man-1", name: "Manzo piccante", price: 6.0, category: "Manzo" },
      {
        id: "man-2",
        name: "Manzo con funghi e bambù",
        price: 6.0,
        category: "Manzo",
      },
      { id: "man-3", name: "Manzo al curry", price: 6.0, category: "Manzo" },
      {
        id: "man-4",
        name: "Manzo in salsa ostrica",
        price: 6.0,
        category: "Manzo",
      },
      {
        id: "man-5",
        name: "Manzo con misto verdura",
        price: 6.0,
        category: "Manzo",
      },
      { id: "man-6", name: "Manzo con sedano", price: 6.0, category: "Manzo" },
      { id: "man-7", name: "Manzo con cipolla", price: 6.0, category: "Manzo" },
      { id: "man-8", name: "Manzo con zai zai", price: 6.0, category: "Manzo" },
    ],
  },
];

export const getAllCategories = (): string[] => {
  return menuData.map((cat) => cat.name);
};

export const getAllItems = () => {
  return menuData.flatMap((cat) => cat.items);
};
