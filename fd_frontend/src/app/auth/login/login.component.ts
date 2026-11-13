import { Component, OnInit } from '@angular/core';
import { IonInput, IonItem, IonButton, IonIcon } from '@ionic/angular/standalone'
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { eye, eyeOff, checkmarkCircle, personCircleOutline } from 'ionicons/icons';
import { LoginCredentials } from '../../interfaces/login-credentials';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../style/auth.scss'],
  imports: [IonButton, IonIcon, IonItem, IonInput, RouterModule, ReactiveFormsModule, CommonModule],
  standalone: true
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  showPassword: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(24),
      ]]
    });
    addIcons({ eye, eyeOff, checkmarkCircle, personCircleOutline });
  }

  ngOnInit() { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToRegister() {
    this.router.navigate(['/user/profile/register']);
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const dati_utente: LoginCredentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(dati_utente).subscribe({
        next: (response) => {
          console.log('Login success:', response);
          this.isLoading = false;
          
          // Gestisci il successo del login
          this.authService.handleLoginSuccess(response);
          
          // Naviga alla homepage
          this.router.navigate(['/user/profile/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login failed', error);
          
          // Gestione specifica degli errori
          this.errorMessage = this.returnErrorMessage(error.status);
        }
      });
    }
    
  }

  returnErrorMessage(status: number): string {
    switch (status) {
      case 401:
        return 'Email o password non corretti';
      case 400:
        return 'Dati non validi';
      case 500:
        return 'Errore del server. Riprova più tardi';
      default:
        return 'Errore durante il login. Riprova';
    }
  }

}
