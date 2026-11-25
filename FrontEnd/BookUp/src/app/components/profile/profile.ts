import { Component, inject, PLATFORM_ID, OnInit, signal} from '@angular/core';
import { Auth } from '../../services/auth';
import { isPlatformBrowser } from '@angular/common';
import { form, required, email, FormField } from '@angular/forms/signals';
import { User } from '../../interfaces/user';
import { ProfileFormModel } from '../../interfaces/profile';

@Component({
  selector: 'app-profile',
  imports: [FormField],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  private authService = inject(Auth);
  private platformId = inject(PLATFORM_ID);

  user = signal<User | null>(null);
  isLoading = signal<boolean>(true);
  isEditing = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  successMessage = signal<string>('');
  errorMessage = signal<string>('');

  // Modelo Signal para editar
  private profileModel = signal<ProfileFormModel>({
    name: '',
    username: '',
    email: '',
    password: ''
  });

  profileForm = form(this.profileModel, (schema) => {
    required(schema.name, { message: 'El nombre es obligatorio' });
    required(schema.username, { message: 'El usuario es obligatorio' });
    required(schema.email, { message: 'El correo es obligatorio' });
    email(schema.email, { message: 'Ingresa un correo válido' });
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProfile();
    }
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.user.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.detail || 'No se pudo cargar el perfil');
        this.isLoading.set(false);
      }
    });
  }

  startEditing(): void {
    const current = this.user();
    if (!current) return;

    this.profileModel.set({
      name: current.name,
      username: current.username,
      email: current.email,
      password: ''
    });
    this.successMessage.set('');
    this.errorMessage.set('');
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
    this.errorMessage.set('');
  }

  saveChanges(event: Event): void {
    event.preventDefault();
    if (this.profileForm().invalid()) return;

    this.isSaving.set(true);
    this.errorMessage.set('');

    const formValue = this.profileModel();

    const payload = {
      name: formValue.name,
      username: formValue.username,
      email: formValue.email,
      password: formValue.password.trim() || undefined
    };

    this.authService.updateProfile(payload).subscribe({
      next: (updatedUser) => {
        this.user.set(updatedUser);
        this.isSaving.set(false);
        this.isEditing.set(false);
        this.successMessage.set('Perfil actualizado correctamente');
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error?.detail || 'Error al actualizar el perfil');
      }
    });
  }

  getErrorMessage(field: any): string | null {
    const state = field();
    if (state.dirty() && state.invalid()) {
      const errors = state.errors();
      return Array.isArray(errors) ? errors[0]?.message : errors?.message;
    }
    return null;
  }
}
