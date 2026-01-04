
import { Product, User } from './types';

/**
 * Demo user data for development and testing
 * 
 * @type {User}
 * @constant
 * @example
 * // Use the demo user
 * console.log(USER.name); // "Alex Doe"
 */
export const USER: User = {
  name: "Alex Doe",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
  memberSince: "2021",
  location: "New York, USA",
  isVip: true,
  role: 'customer'
};

/**
 * Demo product data for development and testing
 * 
 * @type {Product[]}
 * @constant
 * @example
 * // Get first product
 * const firstProduct = PRODUCTS[0];
 * console.log(firstProduct.name); // "Velocity Runner 5000"
 */
export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Velocity Runner 5000",
    brand: "Yapee",
    category: "Running",
    price: 125.00,
    originalPrice: 160.00,
    rating: 4.8,
    reviews: 1248,
    tags: ['new', 'sale'],
    discount: "-20%",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    variants: [
      { id: "v1", productId: "1", size: "8", color: "Black", stock: 10 },
      { id: "v2", productId: "1", size: "9", color: "Black", stock: 15 },
      { id: "v3", productId: "1", size: "10", color: "Black", stock: 5 },
      { id: "v4", productId: "1", size: "9", color: "Red", stock: 8 },
    ]
  },
  {
    id: "2",
    name: "Zoom Pegasus 39",
    brand: "Nike",
    category: "Running",
    price: 72.00,
    originalPrice: 120.00,
    discount: "-40%",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
    variants: [
      { id: "v5", productId: "2", size: "8", color: "Blue", stock: 10 },
      { id: "v6", productId: "2", size: "9", color: "Blue", stock: 15 },
      { id: "v7", productId: "2", size: "10", color: "White", stock: 5 },
    ]
  },
  {
    id: "3",
    name: "Air Max 90 Futura",
    brand: "Nike",
    category: "Lifestyle",
    price: 97.50,
    originalPrice: 150.00,
    discount: "-35%",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
    variants: [
      { id: "v8", productId: "3", size: "8", color: "White", stock: 10 },
      { id: "v9", productId: "3", size: "9", color: "White", stock: 15 },
    ]
  },
  {
    id: "4",
    name: "Vans Old Skool",
    brand: "Vans",
    category: "Skateboarding",
    price: 35.00,
    originalPrice: 70.00,
    discount: "-50%",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80",
    variants: [
      { id: "v10", productId: "4", size: "8", color: "Black", stock: 10 },
      { id: "v11", productId: "4", size: "9", color: "Black", stock: 15 },
    ]
  },
  {
    id: "5",
    name: "Jordan Retro 4",
    brand: "Jordan",
    category: "Basketball",
    price: 168.00,
    originalPrice: 210.00,
    discount: "-20%",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80",
    variants: [
      { id: "v12", productId: "5", size: "9", color: "Black", stock: 10 },
      { id: "v13", productId: "5", size: "10", color: "Black", stock: 15 },
    ]
  },
  {
    id: "6",
    name: "Nike Air Force 1 '07",
    brand: "Nike",
    category: "Lifestyle",
    price: 110.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
    variants: [
      { id: "v14", productId: "6", size: "9", color: "White", stock: 10 },
    ]
  },
  {
    id: "7",
    name: "Adidas Ultraboost Light",
    brand: "Adidas",
    category: "Running",
    price: 190.00,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aef4?w=600&q=80",
    variants: [
      { id: "v15", productId: "7", size: "9", color: "Black", stock: 10 },
    ]
  },
  {
    id: "8",
    name: "Converse Chuck 70",
    brand: "Converse",
    category: "Unisex",
    price: 90.00,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&q=80",
    variants: [
      { id: "v16", productId: "8", size: "9", color: "White", stock: 10 },
    ]
  },
  {
    id: "9",
    name: "New Balance 550",
    brand: "New Balance",
    category: "Lifestyle",
    price: 120.00,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80",
    variants: [
      { id: "v17", productId: "9", size: "9", color: "White", stock: 10 },
    ]
  },
  {
    id: "10",
    name: "Air Jordan 1 Mid SE",
    brand: "Jordan Brand",
    category: "Lifestyle",
    price: 135.00,
    rating: 4.6,
    tags: ['best-seller'],
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
    variants: [
      { id: "v18", productId: "10", size: "9", color: "Black", stock: 10 },
    ]
  },
  {
    id: "11",
    name: "Nike Air Zoom Pegasus",
    brand: "Nike",
    category: "Running",
    price: 120.00,
    rating: 4.5,
    tags: ['new'],
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&q=80",
    variants: [
      { id: "v19", productId: "11", size: "9", color: "Black", stock: 10 },
    ]
  },
  {
    id: "12",
    name: "Nike Metcon 8",
    brand: "Nike",
    category: "Training",
    price: 104.00,
    originalPrice: 130.00,
    rating: 4.7,
    discount: "-20%",
    image: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=600&q=80",
    variants: [
      { id: "v20", productId: "12", size: "9", color: "Black", stock: 10 },
    ]
  }
];

export const CATEGORIES = [
  { name: 'Performance', sub: 'Engineered for speed', img: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80" },
  { name: 'Street Style', sub: 'Everyday essentials', img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80" },
  { name: 'Court Ready', sub: 'Dominate the paint', img: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&q=80" },
  { name: 'All-Day Comfort', sub: 'Walk on clouds', img: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80" }
];

export const IMAGES = {
  HERO: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
  BANNER_URBAN: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&q=80",
  PDP_MAIN: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
  PDP_THUMBS: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80"
  ],
  CHECKOUT_THUMB: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  SUCCESS_HERO: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&q=80",
  TRACK_ORDER_THUMB: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80",
  PROMO_SOCKS: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=400&q=80"
};
