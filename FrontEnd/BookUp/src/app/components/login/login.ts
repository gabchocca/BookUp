import { Component, inject, signal} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { LoginInterface } from '../../interfaces/login-interface';
import { form, required, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private authService = inject(Auth);
  private router = inject(Router);

  // Modelo del formulario
  private loginModel = signal<LoginInterface>({
    identifier: '',
    password: ''
  });

  // Formulario signal
  loginForm = form(this.loginModel, (schema) => {
    required(schema.identifier, { message: 'El usuario o correo es obligatorio' });
    required(schema.password, { message: 'La contraseña es obligatoria' });
  });

  // Control de la pantalla
  errorMessage = signal('');
  isLoading = signal(false);
  showErrorModal = signal(false);

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.loginForm().invalid()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { identifier, password } = this.loginModel();

    this.authService.login(identifier, password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/myBooks']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.detail || 'Error al conectar con el servidor');
        this.showErrorModal.set(true);
      }
    });
  }

  cerrarPopup(): void {
    this.showErrorModal.set(false);
  }

  getErrorMessage(field: any): string | null {
    const state = field();
    if (state.dirty() && state.invalid()) {
      const errors = state.errors();
      return Array.isArray(errors) ? errors[0]?.message : errors?.message;
    }
    return null;
  }

  onCancel(): void {
    this.loginModel.set({ identifier: '', password: '' });
    this.errorMessage.set('');
  }


}
