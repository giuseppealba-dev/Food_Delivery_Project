import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { LoginCredentials } from 'src/app/interfaces/login-credentials';
import { RegisterCredentials } from 'src/app/interfaces/register-credentials';
import { RoleEnum } from 'src/app/interfaces/role-enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/api/auth'; // Modifica con l'URL del tuo backend
  
  // Comportamento per gestire lo stato di autenticazione
  // Si usano gli Observable al posto dei signal di angular poichè sono preferibili
  // per operazioni asincrone (come le chiamate HTTP)
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private accountRoleSubject = new BehaviorSubject<RoleEnum>(RoleEnum.GUEST);
  public accountRole$ = this.accountRoleSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Verifica se l'utente è già loggato al caricamento dell'app
    const token = localStorage.getItem('token');
    this.isAuthenticatedSubject.next(!!token);
    this.accountRoleSubject.next(this.getStoredUserRole());
  }

  // Metodo per la registrazione che restituisce un Observable
  register(credentials: RegisterCredentials) {
    return this.http.post<{ success: boolean, data: any, token: string}>(`${this.baseUrl}/register`, credentials);
  }

  // Metodo separato per gestire la registrazione con navigazione + token di autenticazione
  handleRegisterSuccess(response: { success: boolean, data: any, token: string }) {
    // Se c'è un token, usalo, altrimenti crea un token fittizio per indicare l'autenticazione
    // Poichè lato backend non è implementato il token, si usa un token fittizio
    const token = response.token || 'user_authentication_token' + Date.now(); // Usa un token di esempio se non viene restituito dal server
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(response.data)); // Salva i dati dell'utente nel localStorage
    this.setRole(response); // Imposta il ruolo dell'utente
    this.isAuthenticatedSubject.next(true);
  }

  // Metodo per il login che restituisce un Observable
  login(credentials: LoginCredentials) {
    return this.http.post<{ success: boolean, data: any, token?: string }>(`${this.baseUrl}/login`, credentials);
  }

  // Metodo separato per gestire il login con navigazione + token di autenticazione
  handleLoginSuccess(response: { success: boolean, data: any, token?: string }) {
    // Se c'è un token, usalo, altrimenti crea un token fittizio per indicare l'autenticazione
    // Poichè lato backend non è implementato il token, si usa un token fittizio
    const token = response.token || 'user_authentication_token' + Date.now(); // Usa un token di esempio se non viene restituito dal server
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(response.data)); // Salva i dati dell'utente nel localStorage
    console.log(response.data.REF_ruolo)
    this.setRole(response); // Imposta il ruolo dell'utente
    this.isAuthenticatedSubject.next(true);
  }

  // Metodo per cambiare la password
  changePassword(oldPassword: string, newPassword: string) {
    // verifica o meno se l'utente è autenticato (sarà sempre autenticato)
    const userData = localStorage.getItem('user');
    if (!userData) {
      console.log('Utente non autenticato: ' + userData);
      return Promise.reject({ message: 'Utente non autenticato' });
    }

    const user = JSON.parse(userData);
    const changePasswordData = {
      userId: user.ID_utente,
      oldPassword: oldPassword,
      newPassword: newPassword
    };

    return this.http.post<{ success: boolean, message: string }>(`${this.baseUrl}/change-password`, changePasswordData).toPromise();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.accountRoleSubject.next(RoleEnum.GUEST); // Resetta il ruolo a GUEST
    this.router.navigate(['/user/profile/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  setRole(response: any) {
    const userRole = response.data.REF_ruolo;
    if (userRole == 1) {
      this.accountRoleSubject.next(RoleEnum.UTENTE);
    } else if (userRole == 2) {
      this.accountRoleSubject.next(RoleEnum.FATTORINO);
    } else if (userRole == 3) {
      this.accountRoleSubject.next(RoleEnum.ADMIN);
    } else {
      this.accountRoleSubject.next(RoleEnum.GUEST);
    }
  }

  getStoredUserRole(): RoleEnum {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      const userRole = parsedUser.REF_ruolo;
      if (userRole == 1) {
        return RoleEnum.UTENTE;
      } else if (userRole == 2) {
        return RoleEnum.FATTORINO;
      } else if (userRole == 3) {
        return RoleEnum.ADMIN;
      }
    }
    return RoleEnum.GUEST; // Default role
  }

  // Metodo per ottenere l'ID dell'utente corrente (non molto sicuro, ma funziona per il momento)
  // In un caso reale, si userebbe un metodo più sicuro.
  getCurrentUserId(): number | null {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.ID_utente || null;
    }
    return null;
  }

  // Metodo per ottenere i dati completi dell'utente corrente
  getCurrentUser(): any | null {
    const userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  }

}
