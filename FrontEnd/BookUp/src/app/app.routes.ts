import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { MyBooks } from './components/my-books/my-books';
import { Books } from './components/books/books';
import { Categories } from './components/categories/categories';
import { UploadBook } from './components/upload-book/upload-book';
import { LoginRegister } from './components/login-register/login-register';
import { Register } from './components/register/register';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: "home", component: Home },
  {
    path: "login-register",
    component: LoginRegister,
    children: [
      { path: "login", component: Login },
      { path: "register", component: Register },
      { path: "", redirectTo: "login", pathMatch: "full" }
    ]
  },
  {
    path: "myBooks",
    component: MyBooks,
    canActivate: [authGuard],
    children: [
      { path: "books", component: Books },
      { path: "categories", component: Categories },
      { path: "uploadBook", component: UploadBook },
      { path: "", redirectTo: "books", pathMatch: "full" }
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
