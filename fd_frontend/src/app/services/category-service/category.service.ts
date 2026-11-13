import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddCategory } from '../../interfaces/add-category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = 'http://localhost:3000/api/data/category';

  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get<{ success: boolean, data: any }>(`${this.baseUrl}/list`);
  }

  addCategory(category: AddCategory) {
    return this.http.post<{ success: boolean, message: string, categoria_aggiunta: any }>(`${this.baseUrl}/add`, category);
  }

  removeCategory(id: number) {
    return this.http.post<{ success: boolean, message: string, categoria_rimossa: any }>(`${this.baseUrl}/remove`, { id });
  }
}
