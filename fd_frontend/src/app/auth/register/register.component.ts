import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonInput, IonItem, IonButton, IonIcon } from '@ionic/angular/standalone'
import { addIcons } from 'ionicons';
import { eye, eyeOff, close } from 'ionicons/icons';
import { RegisterCredentials } from '../../interfaces/register-credentials';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../style/auth.scss'],
  imports: [IonButton, IonItem, IonInput, IonIcon, ReactiveFormsModule, CommonModule],
  standalone: true
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  errorMessage: string = '';
  isLoading: boolean = false;

  formato_email: string = '<nome>@<dominio>';
  caratteri_speciali_password: string = '@$!%*?&#';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      cognome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      n_telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Assumento un numero di telefono italiano di 10 cifre
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(24),
        // Validators.pattern('^(?=.*[0-9])(?=.*[.!?@%$#])[a-zA-Z0-9.!?%$#]{8,24}$')
        Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&#])[a-zA-Z0-9@$!%*?&#]{8,24}$')

      ]],
      conferma_password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],

    }, { validators: this.passwordMatchValidator })
    addIcons({ eye, eyeOff, close });
  }

  ngOnInit() { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  navitateToLogin() {
    this.router.navigate(['/user/profile/login']);
  }

  // Validator per controllare se le password corrispondono
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('conferma_password');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onRegisterSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      console.log(this.registerForm.value);

      const dati_utente: RegisterCredentials = {
        nome: this.registerForm.value.nome,
        cognome: this.registerForm.value.cognome,
        numero_telefono: this.registerForm.value.n_telefono,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        conferma_password: this.registerForm.value.conferma_password
      };

      this.authService.register(dati_utente).subscribe({
        next: (response) => {
          console.log('Registration success:', response);
          this.isLoading = false;

          // Gestisci il successo della registrazione
          this.authService.handleRegisterSuccess(response);
          
          // Naviga alla homepage
          this.router.navigate(['/user/profile/dashboard']);

          // this.router.navigate(['/user/profile/login']);
        }, error: (error) => {
          console.error('Registration error:', error);
          this.isLoading = false;

          // Gestione specifica degli errori basata sul messaggio del backend
          if (error.error) {
            // Controlla se ci sono errori di validazione nell'array errors
            if (error.error.errors && Array.isArray(error.error.errors)) {
              // Estrai tutti i messaggi di errore dall'array errors
              const errorMessages = error.error.errors.map((err: any) => err.msg).join(', ');
              this.errorMessage = errorMessages;
            } else if (error.error.message) {
              // Gestisci messaggi di errore singoli
              if (error.error.message.includes('Email già in uso')) {
                this.errorMessage = 'Email già registrata. Prova con un\'altra email';
              } else if (error.error.message.includes('Numero di telefono già in uso')) {
                this.errorMessage = 'Numero di telefono già registrato. Prova con un altro numero';
              } else {
                this.errorMessage = error.error.message;
              }
            } else {
              this.errorMessage = this.returnErrorMessage(error.status);
            }
          } else {
            this.errorMessage = this.returnErrorMessage(error.status);
          }
        }
      });
    }
  }
  returnErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Dati non validi. Verifica che email e numero di telefono non siano già registrati';
      case 422:
        return 'Formato dati non corretto. Controlla i campi inseriti';
      case 409:
        return 'Email o numero di telefono già registrati';
      case 500:
        return 'Errore del server. Riprova più tardi';
      case 0:
        return 'Errore di connessione. Verifica la tua connessione internet';
      default:
        return 'Errore durante la registrazione. Riprova';
    }
  }

}
