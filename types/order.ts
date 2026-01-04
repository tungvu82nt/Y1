import { CartItem, CartItemRequest } from ".";

// Order types
export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: string;
  paymentMethod: string;
  estimatedDelivery: string;
  userId?: string;
  userNotes?: string;
}

export interface OrderCreateRequest {
  items: CartItemRequest[];
  shippingAddress: string;
  paymentMethod: string;
  userNotes?: string;
}

export interface OrderUpdateRequest {
  status?: Order['status'];
  shippingAddress?: string;
  userNotes?: string;
}

export type OrderUpdateMessage = Pick<Order, 'id' | 'status' | 'estimatedDelivery'>;
export type OrderCreateMessage = Order;
