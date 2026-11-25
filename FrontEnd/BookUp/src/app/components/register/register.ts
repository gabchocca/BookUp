import { Component, inject, signal,} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';
import { Auth, } from '../../services/auth';
import { RegisterRequest } from '../../interfaces/register-request';

@Component({
  selector: 'app-register',
  imports: [FormField, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
   private authService = inject(Auth);
  private router = inject(Router);

  // Modelo
  private registerModel = signal<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    name: ''
  });

  // Formulario Signal
  registerForm = form(this.registerModel, (schema) => {
    required(schema.username, { message: 'El usuario es obligatorio' });
    required(schema.email, { message: 'El correo es obligatorio' });
    email(schema.email, { message: 'Ingresa un correo válido' });
    required(schema.password, { message: 'La contraseña es obligatoria' });
    minLength(schema.password, 6, { message: 'Mínimo 6 caracteres' });
    required(schema.name, { message: 'El nombre es obligatorio' });
  });

  // Control de la pantalla
  errorMessage = signal('');
  isLoading = signal(false);
  showErrorModal = signal(false);

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.registerForm().invalid()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register(this.registerModel()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/login-register/login']);
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
    this.registerModel.set({
      username: '',
      email: '',
      password: '',
      name: ''
    });
    this.registerForm().reset();
    this.errorMessage.set('');
    this.router.navigate(['/']);
  }
}
