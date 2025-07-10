import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';
import { LayoutComponent } from './layout.component';
import { IngresarCargasComponent } from './cargas/Ingresar/ingresar-cargas.component';
import { ConsultarCargasComponent } from './cargas/Consultar/consultar-cargas.component';
import { CrearUsuarioComponent } from './cargas/Usuario/crear-usuario.component'; // 👈 nuevo

export const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'menu',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'ingresar-cargas', component: IngresarCargasComponent },
      { path: 'consultar-cargas', component: ConsultarCargasComponent },
      { path: 'crear-usuario', component: CrearUsuarioComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } } // 👈 nuevo
    ]
  },
  { path: '**', redirectTo: '' }
];
