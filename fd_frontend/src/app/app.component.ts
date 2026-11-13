import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from './services/auth-service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router) {
    // this.initializeApp();
  }
  initializeApp() {
    // Reindirizza solo se l'utente è sulla root path
    if (this.router.url === '/') {
      this.authService.isAuthenticated$.subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigate(['user/homepage']);
        } else {
          this.router.navigate(['user/profile/login']);
        }
      });
    }
  }

}
