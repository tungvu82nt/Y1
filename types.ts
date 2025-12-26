
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  tags?: ('new' | 'sale' | 'best-seller' | 'limited')[];
  discount?: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number;
  flag: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface User {
  name: string;
  email?: string;
  avatar: string;
  memberSince: string;
  location: string;
  isVip: boolean;
  role: 'admin' | 'customer';
  phone?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  shippingAddress: string;
  paymentMethod: string;
  estimatedDelivery: string;
}
