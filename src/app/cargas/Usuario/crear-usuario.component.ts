import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})
export class CrearUsuarioComponent implements OnInit {
  usuario = {
    nombre_usuario: '',
    contrasena: '',
    rol: '',
    empresa_id: null
  };

  perfiles: any[] = [];
  mensaje: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('https://www.broomperu.com/BroomPeru/API/perfiles.php')
      .subscribe(res => {
        this.perfiles = res.data;
      });
  }

  guardarUsuario(): void {
    const body = { ...this.usuario };

    this.http.post<any>('https://www.broomperu.com/BroomPeru/API/usuarios.php?action=create', body)
      .subscribe(res => {
        if (res.success) {
          this.mensaje = '✅ Usuario creado correctamente.';
          this.usuario = { nombre_usuario: '', contrasena: '', rol: '', empresa_id: null };
        } else {
          this.mensaje = '❌ ' + res.message;
        }
      });
  }
}
