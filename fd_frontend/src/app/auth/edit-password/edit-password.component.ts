import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInput, IonItem, IonButton, IonIcon, IonHeader } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eye, eyeOff, close } from 'ionicons/icons';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss', '../style/auth.scss'],
  imports: [IonButton, IonItem, IonInput, IonIcon, ReactiveFormsModule, CommonModule],
  standalone: true
})
export class EditPasswordComponent {
  passwordForm: FormGroup;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  errorMessage: string = '';
  isLoading: boolean = false;
  successMessage: string = '';

  caratteri_speciali_password: string = '@$!%*?&#';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(24),
        Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&#])[a-zA-Z0-9@$!%*?&#]{8,24}$')
      ]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });

    addIcons({ eye, eyeOff, close });
  }

  // Validator per controllare se le password corrispondono
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    return newPassword.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  toggleOldPasswordVisibility() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  navigateToProfile() {
    this.router.navigate(['/user/profile']);
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.passwordForm.value;

      this.authService.changePassword(formData.oldPassword, formData.newPassword).then((response) => {
        console.log('Password change success:', response);
        this.isLoading = false;

        if (response && response.success) {
          this.successMessage = 'Password aggiornata con successo!';
          // Attendi un po' prima di navigare per mostrare il messaggio
          setTimeout(() => {
            this.navigateToProfile();
          }, 2000);
        } else {
          this.errorMessage = (response && response.message) || 'Errore durante l\'aggiornamento della password.';
        }
      }).catch((error: any) => {
        console.error('Password change error:', error);
        this.isLoading = false;

        if (error.error) {
          if (error.error.errors && Array.isArray(error.error.errors)) {
            const errorMessages = error.error.errors.map((err: any) => err.msg).join(', ');
            this.errorMessage = errorMessages;
          } else if (error.error.message) {
            if (error.error.message.includes('Password attuale non corretta')) {
              this.errorMessage = 'La password attuale inserita non è corretta';
            } else if (error.error.message.includes('Utente non trovato')) {
              this.errorMessage = 'Errore di autenticazione. Effettua nuovamente il login';
            } else {
              this.errorMessage = error.error.message;
            }
          } else {
            this.errorMessage = this.returnErrorMessage(error.status);
          }
        } else {
          this.errorMessage = this.returnErrorMessage(error.status);
        }
      });
    }
  }

  returnErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Dati non validi. Controlla i campi inseriti';
      case 401:
        return 'Non autorizzato. Effettua nuovamente il login';
      case 404:
        return 'Utente non trovato';
      case 500:
        return 'Errore del server. Riprova più tardi';
      case 0:
        return 'Errore di connessione. Verifica la tua connessione internet';
      default:
        return 'Errore durante l\'aggiornamento della password. Riprova';
    }
  }
}
