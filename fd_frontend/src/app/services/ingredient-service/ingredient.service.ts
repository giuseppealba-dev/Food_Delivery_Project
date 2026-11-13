import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddIngredient } from 'src/app/interfaces/add-ingredient';


@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  private baseUrl = 'http://localhost:3000/api/data/ingredient';
  constructor(private http: HttpClient) { }

  getIngredients() {
    return this.http.get<{ success: boolean, data: any }>(`${this.baseUrl}/list`);
  }

  addIngredient(ingredient: AddIngredient) {
    return this.http.post<{ success: boolean, message: string, ingrediente_aggiunto: any }>(`${this.baseUrl}/add`, ingredient);
  }

  removeIngredient(id: number) {
    return this.http.delete<{ success: boolean, message: string, ingrediente_rimosso: any }>(`${this.baseUrl}/remove`, {
      body: { id }
    });
  }

  linkIngredientsToProduct(productId: number, ingredientIds: number[]) {
    return this.http.post<{ success: boolean, message: string }>(`${this.baseUrl}/linkIngredientsToProduct`, {
      ID_prodotto: productId,
      REFs_ingredienti: ingredientIds
    });
  }

  getIngredientsForProduct(productId: number) {
    return this.http.post<{success: boolean, data: any}>(`${this.baseUrl}/getIngredientsForProduct`, {ID_prodotto: productId})
  }
}
