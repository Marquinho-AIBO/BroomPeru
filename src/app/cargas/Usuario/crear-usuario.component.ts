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
    paginaActual: number = 1;
    registrosPorPagina: number = 10;
    opcionesCantidad: number[] = [5, 10, 25, 50, 100];
    rucsDisponibles: string[] = [];
    perfiles: any[] = [];
    mensaje: string = '';
    empresas: any[] = [];
    filtro: string = '';
    totalRegistros: number = 0;
    todosLosRegistros: any;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
      this.http.get<any>('https://www.broomperu.com/BroomPeru/API/Perfiles.php')
        .subscribe(res => this.perfiles = res.data);
    
      this.cargarEmpresas();
      this.cargarRucsDisponibles(); 
    }

    guardarUsuario(): void {
      const empresaPayload = {
        nombre: this.usuario.nombre_usuario,
        IdPerfil: this.usuario.rol, // ejemplo fijo o puedes mapear según el rol
        RUT: this.usuario.nombre_usuario || 0 // puedes ajustar lógica si tienes RUT real
      };
    
      this.http.post<any>('https://www.broomperu.com/BroomPeru/API/Usuarios.php?action=create_empresa', empresaPayload)
        .subscribe(res => {
          if (res.success) {
            const idEmpresa = res.id_empresa;
            this.mensaje = '✅ Empresa y usuario creados correctamente.';
            const body = {
              ...this.usuario,
              empresa_id: idEmpresa
            };
    
            this.http.post<any>('https://www.broomperu.com/BroomPeru/API/Usuarios.php?action=create', body)
              .subscribe(res2 => {
                if (res2.success) {
                  this.mensaje = '✅ Empresa y usuario creados correctamente.';
                  this.resetFormulario();
                  this.cargarEmpresas(); // refrescar tabla
                } else {
                  this.mensaje = '❌ ' + res2.message;
                }
              });
          } else {
            this.mensaje = '❌ ' + res.message;
          }
        });
    }
    cargarRucsDisponibles(): void {
      this.http.get<any>('https://www.broomperu.com/BroomPeru/API/Usuarios.php?action=listar_ruc_disponibles')
        .subscribe(res => {
          if (res.success) {
            this.rucsDisponibles = res.data;
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

eliminarEmpresa(id: number): void {
  if (!confirm('¿Estás seguro de eliminar esta empresa?')) return;

  this.http.get<any>(`https://www.broomperu.com/BroomPeru/API/Usuarios.php?action=delete_empresa&empresa_id=${id}`)
  .subscribe(res => {
      if (res.success) {
        this.mensaje = '✅ Empresa eliminada correctamente.';
        this.cargarEmpresas(); // vuelve a cargar lista actualizada
      } else {
        this.mensaje = '❌ ' + res.message;
      }
    });
}
get totalPaginas(): number[] {
  const total = Math.ceil(this.totalRegistros / this.registrosPorPagina);
  return Array(total).fill(0).map((_, i) => i + 1);
}
get registrosPaginados() {
  const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
  return this.todosLosRegistros.slice(inicio, inicio + this.registrosPorPagina);
}


  }
