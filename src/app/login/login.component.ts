import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // 👈 AQUI agregas HttpClientModule
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';

  constructor(private loginService: LoginService, private AppRouter: Router) {}

  onLogin() {
    this.loginService.login(this.username, this.password).subscribe(response => {
      console.log('Respuesta API:', response);
  
      if (response && response.success) {
        this.message = 'Login exitoso. Redirigiendo...';
        localStorage.setItem('user', JSON.stringify(response.user));
        this.AppRouter.navigate(['/menu/consultar-cargas']);
      } else {
        this.message = response?.message || 'Error en la respuesta del servidor.';
      }
    }, error => {
      console.error('Error en la API:', error);
      this.message = 'Error en la comunicación con el servidor.';
    });
  }
  
}
