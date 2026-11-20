import { Component, inject, signal, viewChild, ElementRef } from '@angular/core';
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


  private errorDialog = viewChild<ElementRef<HTMLDialogElement>>('errorDialog');
  // modelo del formulario
  private loginModel = signal<LoginInterface>({
    identifier: '',
    password: ''
  });

  // formulario signal
  loginForm = form(this.loginModel, (schema) => {
    required(schema.identifier, { message: 'El usuario o correo es obligatorio' });
    required(schema.password, { message: 'La contraseña es obligatoria' });
  });

  //Control de la pantalla
  errorMessage = signal('');
  isLoading = signal(false);

onSubmit(event: Event): void {
  event.preventDefault();
  console.log('1. Clic en Enviar detectado');
  console.log('2. Contenido de loginModel:', this.loginModel());
  console.log('3. ¿Formulario inválido?:', this.loginForm().invalid());

  // Quitamos el if temporalmente para forzar que salga a Network
  this.isLoading.set(true);
  this.errorMessage.set('');

  const { identifier, password } = this.loginModel();

  this.authService.login(identifier, password).subscribe({
    next: () => {
      this.isLoading.set(false);
      this.router.navigate(['/']);
    },
    error: (err) => {
      console.log('4. Respuesta de error de FastAPI:', err);
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
    this.loginModel.set({ identifier: '', password: '' });
    this.errorMessage.set('');
  }
}
