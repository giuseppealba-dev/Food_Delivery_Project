import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddProduct } from 'src/app/interfaces/add-product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:3000/api/data/product';

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<{ success: boolean, data: any }>(`${this.baseUrl}/listProducts`);
  }

  addProduct(product: AddProduct) {
    return this.http.post<{ success: boolean, prodotto_aggiunto: any }>(`${this.baseUrl}/add`, {
      nome_prodotto: product.nome_prodotto,
      prezzo: product.prezzo,
      url_immagine: product.url_immagine,
      REF_categoria: product.REF_categoria,
      percentuale_sconto: product.percentuale_sconto
    });
  }

  getProductByID(id: number) {
    return this.http.post<{ success: boolean, data: any }>(`${this.baseUrl}/getID`, { id });
  }

  updateProduct(id: number, product: AddProduct) {
    return this.http.put<{ success: boolean, message: string, prodotto_aggiornato: any }>(`${this.baseUrl}/update/${id}`, {
      nome_prodotto: product.nome_prodotto,
      prezzo: product.prezzo,
      url_immagine: product.url_immagine,
      REF_categoria: product.REF_categoria,
      percentuale_sconto: product.percentuale_sconto
    });
  }

  removeProduct(id: number) {
    return this.http.delete<{ success: boolean, message: string, prodotto_rimosso: any }>(`${this.baseUrl}/remove`, {
      body: { id }
    });
  }
}
