




export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  stock: number;
}

// Product types
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
  tags?: string[];
  discount?: string;
  variants?: ProductVariant[];
}

export interface ProductCreateRequest {
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  tags?: ('new' | 'sale' | 'best-seller' | 'limited')[];
  description?: string;
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  id: string;
}

// Currency types
export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number;
  flag: string;
}

export interface CurrencyUpdateRequest {
  code: string;
  rate: number;
}

// Cart Item types
export interface CartItem extends Product {
  cartItemId?: string; // Unique ID from database for server sync
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface CartItemRequest {
  productId: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface CartItemUpdateRequest {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

// User types
export interface User {
  id?: string;
  name: string;
  email?: string;
  avatar: string;
  memberSince: string;
  location: string;
  isVip: boolean;
  role: 'ADMIN' | 'CUSTOMER';
  phone?: string;
  token?: string; // For auth context
}

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  avatar?: string;
  location?: string;
  phone?: string;
}


