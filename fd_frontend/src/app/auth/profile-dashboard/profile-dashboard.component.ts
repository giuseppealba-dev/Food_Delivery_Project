import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon } from '@ionic/angular/standalone'
import { AuthService } from '../../services/auth-service/auth.service';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { personOutline, logOutOutline, footstepsOutline, listOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoleEnum } from 'src/app/interfaces/role-enum';

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.scss'],
  imports: [IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, CommonModule],
  standalone: true
})
export class ProfileDashboardComponent implements OnInit, OnDestroy {
  user: any = null;
  private roleSubscription: Subscription;
  public currentRole: RoleEnum = RoleEnum.GUEST; // Inizializza il ruolo come GUEST
  public roles = [RoleEnum.GUEST, RoleEnum.UTENTE, RoleEnum.FATTORINO, RoleEnum.ADMIN]

  constructor(private authService: AuthService, private router: Router) {
    this.roleSubscription = this.authService.accountRole$.subscribe(role => {
      // Logica per gestire il ruolo dell'utente, se necessario
      console.log('Ruolo dell\'utente in dashboard:', role);
      this.currentRole = role;
    })
    addIcons({listOutline,footstepsOutline,personOutline,logOutOutline});
  }

  ngOnInit() {
    // Recupera i dati dell'utente dal localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }

  ngOnDestroy(): void {
    if(this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

  editPassword() {
    this.router.navigate(['/user/profile/editPassword']);
  }

  listIndirizzi() {
    this.router.navigate(['/user/profile/listIndirizzi']);
  }

  storicoOrdini() {
    this.router.navigate(['/user/profile/storicoOrdini']);
  }

  logout() {
    // Logica per effettuare il logout
    this.authService.logout();
  }
}
