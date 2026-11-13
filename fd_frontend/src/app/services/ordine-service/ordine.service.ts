import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../../interfaces/cart-item';
import { OrdineRequest } from 'src/app/interfaces/ordine-request';
import { OrdineResponse } from 'src/app/interfaces/ordine-response';

@Injectable({
  providedIn: 'root'
})
export class OrdineService {
  private baseUrl = 'http://localhost:3000/api/data/ordine';

  constructor(private http: HttpClient) { }

  createOrder(cartItems: CartItem[], userId: number, indirizzoId: number) {
    const request: OrdineRequest = {
      cartItems,
      userId,
      indirizzoId
    };

    return this.http.post<OrdineResponse>(`${this.baseUrl}/create`, request);
  }

  getUserOrders(userId: number) {
    return this.http.get<{ success: boolean, data: any[] }>(`${this.baseUrl}/user/${userId}`);
  }

  getOrderProducts(orderId: number) {
    return this.http.get<{ success: boolean, data: any[] }>(`${this.baseUrl}/${orderId}/products`);
  }

  updateOrderStatus(orderId: number, status: string, fattorinoId?: number) {
    const body: { status: string, fattorinoId?: number } = { status };
    if (fattorinoId) {
      body.fattorinoId = fattorinoId;
    }
    return this.http.put<{ success: boolean, message: string, data?: any }>(`${this.baseUrl}/${orderId}/status`, body);
  }

  getAllOrders() {
    return this.http.get<{ success: boolean, data: any[] }>(`${this.baseUrl}/all`);
  }
}
