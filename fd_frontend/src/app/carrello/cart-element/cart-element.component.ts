import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../interfaces/cart-item';
import {
  IonItem,
  IonThumbnail,
  IonIcon,
  IonLabel,
  IonButton,
  IonImg
} from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { add, trash, remove } from 'ionicons/icons';

@Component({
  selector: 'app-cart-element',
  templateUrl: './cart-element.component.html',
  styleUrls: ['./cart-element.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonItem,
    IonThumbnail,
    IonIcon,
    IonLabel,
    IonButton,
    IonImg
  ]
})
export class CartElementComponent {
  // Input per ricevere l'item del carrello
  cartItem = input.required<CartItem>();

  // Output per aumentare la quantità
  increaseQuantity = output<CartItem>();

  // Output per ridurre la quantità
  decreaseQuantity = output<CartItem>();

  // Output per rimuovere l'item dal carrello
  removeItem = output<CartItem>();

  constructor() {
    addIcons({ add, trash, remove });
  }

  getTotalPrice(): number {
    const item = this.cartItem();
    return item.prezzo * item.quantity;
  }

  onIncreaseQuantity(): void {
    this.increaseQuantity.emit(this.cartItem());
  }

  onDecreaseQuantity(): void {
    this.decreaseQuantity.emit(this.cartItem());
  }

  onRemoveItem(): void {
    this.removeItem.emit(this.cartItem());
  }
}
