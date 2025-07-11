import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userJson = localStorage.getItem('user');

  if (!userJson) {
    router.navigate(['/login']);
    return false;
  }

  const user = JSON.parse(userJson);
  const rolesPermitidos = route.data?.['roles'] as string[];

  // Si no se especifican roles, permitir acceso
  if (!rolesPermitidos || rolesPermitidos.length === 0) {
    return true;
  }

  // Permitir acceso solo si el rol del usuario está dentro de los roles permitidos
  if (rolesPermitidos.includes(user.rol)) {
    return true;
  }

  // Redirigir si el rol no tiene acceso
  router.navigate(['/menu']);
  return false;
};
