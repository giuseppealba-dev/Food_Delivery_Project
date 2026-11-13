import { Component, EnvironmentInjector, inject, OnDestroy } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, cartOutline, personCircleOutline, homeOutline, mapOutline, cogOutline, carOutline, receiptOutline} from 'ionicons/icons';
import { AuthService } from '../services/auth-service/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { RoleEnum } from '../interfaces/role-enum';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage implements OnDestroy {
  // Messo già di suo da Ionic
  public environmentInjector = inject(EnvironmentInjector);

  public isLoggedIn: boolean = false;
  public currentRole: RoleEnum = RoleEnum.GUEST; // Inizializza il ruolo come GUEST
  public roles = [RoleEnum.GUEST, RoleEnum.UTENTE, RoleEnum.FATTORINO, RoleEnum.ADMIN] 

  // Sottoscrizione per monitorare lo stato di autenticazione (osservabile).
  // serve per poter cambiare il nome della tab "Profilo" in base allo stato di autenticazione dell'utente.
  public authSubscription: Subscription;
  public roleSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ triangle, ellipse, square, cartOutline, personCircleOutline, homeOutline, mapOutline, cogOutline, carOutline, receiptOutline });

    // Utilizza il servizio AuthService per verificare se l'utente è autenticato
    // e aggiorna la variabile isLoggedIn di conseguenza.
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isLoggedIn = isAuth;
    })
    this.roleSubscription = this.authService.accountRole$.subscribe(role => {
      console.log('Ruolo dell\'utente:', role);
      this.currentRole = role;
    })
  }

  ngOnDestroy() {
    // Logica di pulizia o unsubscribe da osservabili se necessario
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if(this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

  gestisciClickProfile() {
    if (this.authService.isLoggedIn()) {
      // Se l'utente è loggato, reindirizza alla dashboard
      this.router.navigate(['/user/profile/dashboard']);
    } else {
      // Se l'utente non è loggato, reindirizza al login
      this.router.navigate(['/user/profile/login']);
    }
  }
}