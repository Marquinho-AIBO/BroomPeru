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
      id : 0,
      nombre_usuario: '',
      contrasena: '',
      rol: '',
      empresa_id: 0
    };

    perfiles: any[] = [];
    mensaje: string = '';
    empresas: any[] = [];
    filtro: string = '';

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
      this.http.get<any>('https://www.broomperu.com/BroomPeru/API/Perfiles.php')
        .subscribe(res => this.perfiles = res.data);
    
      this.cargarEmpresas();
    }

    guardarUsuario(): void {
      const body = { ...this.usuario };
    
      // Crear o actualizar según presencia de ID
      const action = this.usuario.id ? 'update' : 'create';
    
      this.http.post<any>(`https://www.broomperu.com/BroomPeru/API/Usuarios.php?action=${action}`, body)
        .subscribe(res => {
          if (res.success) {
            this.mensaje = this.usuario.id
              ? '✅ Usuario actualizado correctamente.'
              : '✅ Usuario creado correctamente.';
    
            this.resetFormulario();
            this.cargarEmpresas(); // Refrescar tabla
          } else {
            this.mensaje = '❌ ' + res.message;
          }
        });
    }
    
    actualizarUsuario(): void {
      const body = { ...this.usuario };
    
      this.http.post<any>('https://www.broomperu.com/BroomPeru/API/Usuarios.php?action=update', body)
        .subscribe(res => {
          if (res.success) {
            this.mensaje = '✅ Usuario actualizado correctamente.';
            this.usuario = { id:0,nombre_usuario: '', contrasena: '', rol: '', empresa_id: 0 };
            this.cargarEmpresas();
          } else {
            this.mensaje = '❌ ' + res.message;
          }
        });
    }
    
    usuariosEmpresariales: any[] = [];

    cargarEmpresas() {
      this.http.get<any>('https://www.broomperu.com/BroomPeru/API/Usuarios.php?action=listar_empresas')
        .subscribe(res => {
          if (res.success) {
            this.usuariosEmpresariales = res.data;
          }
        });
    }
    seleccionarUsuario(usuario: any): void {
      this.usuario = { ...usuario };
    }
    
    
    
resetFormulario(): void {
  this.usuario = {
    id: 0,
    nombre_usuario: '',
    contrasena: '',
    rol: '',
    empresa_id: 0
  };
  this.mensaje = '';
}

get usuariosFiltrados(): any[] {
  if (!this.filtro.trim()) {
    return this.usuariosEmpresariales;
  }

  const texto = this.filtro.trim().toLowerCase();

  return this.usuariosEmpresariales.filter(usuario =>
    Object.values(usuario).some(valor =>
      String(valor).toLowerCase().includes(texto)
    )
  );
}
  }
