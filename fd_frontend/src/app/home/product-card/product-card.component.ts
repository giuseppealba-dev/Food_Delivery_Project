import { Component, input, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonTextarea,
  IonImg,
  IonChip,
  IonButtons
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';
import { cartOutline, close, cart, arrowBack, add, remove } from 'ionicons/icons';
import { CartItem } from '../../interfaces/cart-item';
import { CarrelloService } from '../../services/carrello-service/carrello.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonTextarea,
    IonImg,
    IonChip,
    IonButtons
  ],
  standalone: true,
})
export class ProductCardComponent implements OnInit {
  constructor(private carrelloService: CarrelloService) {
    addIcons({ cartOutline, close, cart, arrowBack, add, remove });
  }

  ngOnInit() { }

  id = input(0);
  nome = input('');
  img_url = input('');
  is_offerta = input(false);
  percentuale_offerta = input(0);
  prezzo = input(0);
  ingredients = input('');

  // Proprietà per gestire la modale inline
  isModalOpen = false;
  notes = '';
  quantity = 1;

  // Calcola il prezzo scontato
  get prezzoScontato(): number {
    if (this.is_offerta() && this.percentuale_offerta() > 0) {
      const sconto = (this.prezzo() * this.percentuale_offerta()) / 100;
      return this.prezzo() - sconto;
    }
    return this.prezzo();
  }

  // Verifica se il prodotto ha uno sconto effettivo
  get hasDiscount(): boolean {
    return this.is_offerta() && this.percentuale_offerta() > 0;
  }

  // Calcola il prezzo scontato per la modale
  get discountedPrice(): number {
    if (this.is_offerta() && this.percentuale_offerta() > 0) {
      return this.prezzo() * (1 - this.percentuale_offerta() / 100);
    }
    return this.prezzo();
  }

  // Lista ingredienti per la modale
  get ingredientsList(): string[] {
    return this.ingredients() ? this.ingredients().split(', ') : [];
  }

  openProductModal() {
    this.isModalOpen = true;
    this.notes = ''; // Reset delle note
    this.quantity = 1; // Reset della quantità
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Metodi per gestire la quantità
  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {

    const cartItem: CartItem = {
      id_prodotto: this.id(),
      nome_prodotto: this.nome(),
      url_immagine: this.img_url(), 
      prezzo: this.prezzoScontato, 
      is_offerta: this.is_offerta(),
      percentuale_offerta: this.percentuale_offerta(),
      notes: this.notes,
      quantity: this.quantity
    }

    console.log('Aggiungendo al carrello:', cartItem);
    /////TODO: Implementare logica per aggiungere al carrello
    this.carrelloService.addToCart(cartItem);

    this.notes = ''; // Reset delle note dopo l'aggiunta // ? INUTILE?
    this.closeModal();
  }

  onAddToCartClick(event: Event) {
    // DA CHATGPT: Impedisce la propagazione del click alla card
    event.stopPropagation();

    const cartItem: CartItem = {
      id_prodotto: this.id(),
      nome_prodotto: this.nome(),
      url_immagine: this.img_url(), 
      prezzo: this.prezzoScontato,
      is_offerta: this.is_offerta(),
      percentuale_offerta: this.percentuale_offerta(),
      notes: "", 
      quantity: 1 
    }

    ///// TODO: Implementare logica diretta per aggiungere al carrello
    this.carrelloService.addToCart(cartItem);
    console.log('Aggiunto al carrello direttamente dalla card:', cartItem);
  }
}
