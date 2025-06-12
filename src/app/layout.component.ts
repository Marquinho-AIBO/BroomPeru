import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent {
  userProfile: string = '';
  constructor(private router: Router) {
    const user = localStorage.getItem('user');
    console.log(localStorage);
    if (user) {
      const userObj = JSON.parse(user);
      this.userProfile = userObj.rol;  // suponiendo que en la tabla tienes "perfil"
      console.log("rol" + this.userProfile);
    }
  }
  logout() {
    this.router.navigate(['/login']);
  }
}
