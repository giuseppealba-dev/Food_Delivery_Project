import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IndirizzoResponse } from 'src/app/interfaces/indirizzo-response';
import { SingleIndirizzoResponse } from 'src/app/interfaces/single-indirizzo-response';
import { Indirizzo } from 'src/app/interfaces/indirizzo';

@Injectable({
  providedIn: 'root'
})
export class IndirizzoService {
  private apiUrl = 'http://localhost:3000/api/data/indirizzo';

  constructor(private http: HttpClient) { }

  // Ottieni tutti gli indirizzi di un utente
  getIndirizziByUser(userID: number) {
    return this.http.get<IndirizzoResponse>(`${this.apiUrl}/user/${userID}`);
  }

  // Ottieni un singolo indirizzo
  getIndirizzoById(id: number) {
    return this.http.get<SingleIndirizzoResponse>(`${this.apiUrl}/${id}`);
  }

  // Aggiungi un nuovo indirizzo
  addIndirizzo(indirizzo: Indirizzo) {
    return this.http.post<SingleIndirizzoResponse>(`${this.apiUrl}/addIndirizzo`, indirizzo);
  }

  // Elimina un indirizzo
  deleteIndirizzo(id: number) {
    return this.http.delete<{ success: boolean; message?: string }>(`${this.apiUrl}/${id}`);
  }
}
