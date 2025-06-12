import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { authGuard } from './guards/auth.guard';  // <== IMPORTAR EL GUARD
import { LayoutComponent } from './layout.component';
import { IngresarCargasComponent } from './cargas/ingresar-cargas.component';
import { ConsultarCargasComponent } from './cargas/consultar-cargas.component';

export const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: LayoutComponent, canActivate: [authGuard], children: [
      { path: 'ingresar-cargas', component: IngresarCargasComponent },
      { path: 'consultar-cargas', component: ConsultarCargasComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
