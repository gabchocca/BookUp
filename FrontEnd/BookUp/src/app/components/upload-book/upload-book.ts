import { Component, inject, signal} from '@angular/core';
import { BookService } from '../../services/book-service';
import { Router } from '@angular/router';
import { form, required, FormField } from '@angular/forms/signals';
import { BookRequest } from '../../interfaces/book';
import { DirectoryResponse } from '../../interfaces/directory-response';

@Component({
  selector: 'app-upload-book',
  imports: [FormField],
  templateUrl: './upload-book.html',
  styleUrl: './upload-book.css',
})
export class UploadBook {
  private bookService = inject(BookService);
  private router = inject(Router);

  // Modelo con la única interfaz
  private uploadModel = signal<BookRequest>({
    title: '',
    author: '',
    description: '',
    review: '',
    path: ''
  });

  uploadForm = form(this.uploadModel, (schema) => {
    required(schema.title, { message: 'El nombre del libro es obligatorio' });
    required(schema.path, { message: 'La dirección del archivo es obligatoria' });
  });

  errorMessage = signal('');
  isLoading = signal(false);
  showErrorModal = signal(false);

  // Signals para el Modal Explorador de Archivos
  showExplorerModal = signal(false);
  isLoadingExplorer = signal(false);
  directoryData = signal<DirectoryResponse>({
    current_path: '',
    parent_path: null,
    folders: [],
    files: []
  });

  openExplorer(): void {
    this.showExplorerModal.set(true);
    this.loadFolder();
  }

  closeExplorer(): void {
    this.showExplorerModal.set(false);
  }

  loadFolder(folderPath?: string): void {
    this.isLoadingExplorer.set(true);
    this.bookService.browseDirectory(folderPath).subscribe({
      next: (data) => {
        this.directoryData.set(data);
        this.isLoadingExplorer.set(false);
      },
      error: () => {
        this.isLoadingExplorer.set(false);
      }
    });
  }

  enterFolder(folderName: string): void {
    const current = this.directoryData().current_path;
    if (!current) {
      this.loadFolder(folderName);
    } else {
      const separator = current.endsWith('\\') ? '' : '\\';
      this.loadFolder(`${current}${separator}${folderName}`);
    }
  }

  goBackFolder(): void {
    const parent = this.directoryData().parent_path;
    if (parent !== null) {
      this.loadFolder(parent);
    }
  }

  selectPdfFile(fileName: string): void {
    const current = this.directoryData().current_path;
    const separator = current.endsWith('\\') ? '' : '\\';
    const fullPath = `${current}${separator}${fileName}`;
    const cleanTitle = fileName.replace(/\.pdf$/i, '');

    this.uploadModel.update(model => ({
      ...model,
      path: fullPath,
      title: model.title || cleanTitle
    }));

    this.closeExplorer();
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.uploadForm().invalid()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.bookService.uploadBook(this.uploadModel()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/myBooks/books']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.detail || 'Error al subir el libro');
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
    this.uploadModel.set({
      title: '',
      author: '',
      description: '',
      review: '',
      path: ''
    });
    this.errorMessage.set('');
  }
}
