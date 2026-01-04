import { Product, CartItem } from "../types";

export interface CartItemResponse {
    id: string;
    productId: string;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
    product: Product;
}

export interface CartResponse {
    items: CartItemResponse[];
}

export interface CartUpdateMessage {
    type: 'cart_update';
    action: 'add' | 'remove' | 'update' | 'clear';
    item?: CartItem;
    items?: CartItem[];
}
