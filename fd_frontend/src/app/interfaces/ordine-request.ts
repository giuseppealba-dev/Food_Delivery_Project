import { CartItem } from "./cart-item";

export interface OrdineRequest {
    cartItems: CartItem[];
    userId: number;
    indirizzoId: number;
}
