  import { CommonModule } from '@angular/common';
  import { HttpClient, HttpClientModule } from '@angular/common/http';
  import { Component } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { OnInit } from '@angular/core';

  @Component({
    selector: 'app-consultar-cargas',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './consultar-cargas.component.html',
    styleUrl: './consultar-cargas.component.scss'
  })
  
  export class ConsultarCargasComponent {

    columnasVisibles: { [key: string]: boolean } = {};
    apiUrl = 'https://www.broomperu.com/BroomPeru/API/cargaRegistros.php';
    carga: any = {
      carga_id: 1,
      usuario_id: 1,
      MES: '',
      COM: '',
      REF_OP: '',
      COD_SAP_HIJO: '',
      STATUS: '',
      TIPO: '',
      SERVICIO: '',
      UTILIDAD: '',
      AGENTE: '',
      SHIPPER: '',
      CONSIGNEE: '',
      BOOKING: '',
      MBL_MAWB: '',
      HBL_HAWB: '',
      ETD: '',
      NAVIERA_COLOADER: '',
      WEEK: '',
      ETA: '',
      COND: '',
      NUMERO_CONTS: 0,
      CANT: 0,
      SIZE: '',
      TYPE: '',
      KILOS: 0,
      VESSEL: '',
      VIAJE: '',
      PORT_LOADING: '',
      PORT_DISCHARGE: '',
      PUERTO_ATRAQUE: '',
      DT: '',
      DIAS_SE: '',
      ADUANA_MANIF: '',
      NRO_MANIFIESTO: '',
      AGENTE_ADUANA: '',
      DAM: '',
      FECHA_REGULARIZADA: '',
      NRO_TICKET: '',
      FECHA_HORA_TRANSMISION: '',
      COMENTARIOS: '',
      RUT: ''
    };

    registros: any[] = [];
    HBL_HAWB_original: any;
    modoEdicion: boolean | undefined;
    mostrarModal: boolean | undefined;
    userProfile: any;
    userRut: any;
    
  filtroTexto: string = '';
  paginaActual: number = 1;
  registrosPorPagina: number = 5;
  ordenColumna: string = '';
  ordenAscendente: boolean = true;
    constructor(private http: HttpClient) {
      const user = localStorage.getItem('user');
      console.log(localStorage);
      if (user) {
        const userObj = JSON.parse(user);
        this.userProfile = userObj.rol;  
        } 
    }

ngOnInit(): void {
      const user = localStorage.getItem('user');
  if (user) {
    const userObj = JSON.parse(user);
    this.userProfile = userObj.rol;
    this.userRut = userObj.rut; // por si necesitas usar el rut también
  }
      this.definirColumnasPorPerfil();
      this.cargarRegistros();
}
definirColumnasPorPerfil() {
  const perfil = this.userProfile;

  const todas = {
    MES: true, COM: true, REF_OP: true, COD_SAP_HIJO: true, STATUS: true,
    TIPO: true, SERVICIO: true, UTILIDAD: true, AGENTE: true, SHIPPER: true,
    CONSIGNEE: true, BOOKING: true, MBL_MAWB: true, HBL_HAWB: true, ETD: true,
    NAVIERA_COLOADER: true, WEEK: true, ETA: true, COND: true,
    NUMERO_CONTS: true, CANT: true, SIZE: true, TYPE: true, KILOS: true,
    VESSEL: true, VIAJE: true, PORT_LOADING: true, PORT_DISCHARGE: true,
    PUERTO_ATRAQUE: true, DT: true, DIAS_SE: true, ADUANA_MANIF: true,
    NRO_MANIFIESTO: true, AGENTE_ADUANA: true, DAM: true,
    FECHA_REGULARIZADA: true, NRO_TICKET: true, FECHA_HORA_TRANSMISION: true,
    COMENTARIOS: true, RUT: true
  };

  const empresas = {
    TIPO: true, SHIPPER: true, CONSIGNEE: true, MBL_MAWB: true, HBL_HAWB: true,
    ETD: true, NAVIERA_COLOADER: true, ETA: true, COND: true,
    NUMERO_CONTS: true, CANT: true, SIZE: true, TYPE: true, KILOS: true,
    VESSEL: true, VIAJE: true, PORT_LOADING: true, PORT_DISCHARGE: true,
    PUERTO_ATRAQUE: true, DT: true, ADUANA_MANIF: true, NRO_MANIFIESTO: true,
    FECHA_HORA_TRANSMISION: true, RUT: true
  };

  const aduanero = { ...todas };

  if (perfil === 'Administrador') this.columnasVisibles = todas;
  else if (perfil === 'Aduanero') this.columnasVisibles = aduanero;
  else if (perfil === 'Empresas') this.columnasVisibles = empresas;
}
    cargarRegistros() {
      this.http.get<any>(`${this.apiUrl}?action=list`).subscribe(response => {
        console.log(this.userProfile);
        if (response.success) {
          if (this.userProfile === 'Empresas') {
            const user = JSON.parse(localStorage.getItem('user')!);
            const rutUsuario = user.rut;
    
            // Mostrar solo registros que coinciden con su RUT
            this.registros = response.data.filter((reg: any) => reg.RUT === rutUsuario);
          } else {
            console.log("else")
            this.registros = response.data;
          }
        } else {
          console.error('Error al cargar registros:', response.message);
        }
      });
    }
    cargarEnFormulario(reg: any) {
      console.log("entro");
      if (this.userProfile !== 'Administrador') return;
    console.log("entro 2")
      this.carga = { ...reg };
      this.HBL_HAWB_original = reg.HBL_HAWB;
      this.modoEdicion = true;
      this.mostrarModal = true;
    }
    
    cerrarModal() {
      this.mostrarModal = false;
    }
    guardarRegistro() {
      if (this.modoEdicion) {
        // 🚀 MODO MODIFICAR (UPDATE)
        const bodyUpdate = {
          ...this.carga,
          HBL_HAWB: this.HBL_HAWB_original  // importante! usamos el original
        };
    
        this.http.post<any>(`${this.apiUrl}?action=update`, bodyUpdate).subscribe(response => {
          if (response.success) {
            alert('Registro modificado correctamente!');
            
            this.cargarRegistros();
            this.cerrarModal();
          } else {
            alert('Error al modificar: ' + response.message);
          }
        }, error => {
          console.error('Error:', error);
          alert('Error en la comunicación con el servidor.');
        });
    
      } 
    }
    registrosFiltradosPaginados() {
      let datos = [...this.registros];
    
      // Filtro
      if (this.filtroTexto.trim()) {
        const filtro = this.filtroTexto.toLowerCase();
        datos = datos.filter(reg =>
          Object.values(reg).some(val => val?.toString().toLowerCase().includes(filtro))
        );
      }
    
      // Orden
      if (this.ordenColumna) {
        datos.sort((a, b) => {
          const aVal = a[this.ordenColumna];
          const bVal = b[this.ordenColumna];
          return this.ordenAscendente
            ? aVal > bVal ? 1 : -1
            : aVal < bVal ? 1 : -1;
        });
      }
    
      // Paginación
      const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
      return datos.slice(inicio, inicio + this.registrosPorPagina);
    }
    
    ordenarPor(columna: string) {
      if (this.ordenColumna === columna) {
        this.ordenAscendente = !this.ordenAscendente;
      } else {
        this.ordenColumna = columna;
        this.ordenAscendente = true;
      }
    } 
    totalPaginas(): number[] {
      const total = Math.ceil(this.registros.length / this.registrosPorPagina);
      return Array.from({ length: total }, (_, i) => i + 1);
    }
  }
