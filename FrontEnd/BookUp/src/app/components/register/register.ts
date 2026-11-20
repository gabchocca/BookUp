import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';
import { Auth, } from '../../services/auth';
import { RegisterRequest } from '../../interfaces/register-request';

@Component({
  selector: 'app-register',
  imports: [FormField],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(Auth);
  private router = inject(Router);

  private errorDialog = viewChild<ElementRef<HTMLDialogElement>>('errorDialog');

  // Modelo del formulario con los 4 campos
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

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.registerForm().invalid()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    // Envía { username, email, password, name } al backend
    this.authService.register(this.registerModel()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['../login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.detail || 'Error al conectar con el servidor');
        this.errorDialog()?.nativeElement.showModal();
      }
    });
  }

  cerrarPopup(): void {
    this.errorDialog()?.nativeElement.close();
  }

  onCancel(): void {
    this.registerModel.set({
      username: '',
      email: '',
      password: '',
      name: ''
    });
    this.errorMessage.set('');
  }
}
