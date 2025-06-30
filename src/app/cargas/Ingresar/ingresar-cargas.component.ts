import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-ingresar-cargas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './ingresar-cargas.component.html',
  styleUrls: ['./ingresar-cargas.component.scss']
})
export class IngresarCargasComponent implements OnInit {
  modoEdicion: boolean = false;
  HBL_HAWB_original: string = '';
  
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

  
  mostrarModal: boolean | undefined;
  userProfile: string = '';
  
 
  
  
 
  registros: any[] = []; // aquí tu data cargada
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
    this.cargarRegistros();
  }

  guardarRegistro() {
    if (!this.carga.HBL_HAWB || this.carga.HBL_HAWB.trim() === '') {
      alert('El campo HBL/HAWB no puede estar vacío.');
      return;
    }
  
    this.http.post<any>(`${this.apiUrl}?action=insert`, this.carga).subscribe(response => {
      if (response.success) {
        alert('Registro guardado correctamente!');
        this.limpiarFormulario();
        this.cerrarModal();     
        this.cargarRegistros();
      } else {
        alert('Error al guardar: ' + response.message);
      }
    }, error => {
      console.error('Error:', error);
      alert('Error en la comunicación con el servidor.');
    });
  }
  cargarRegistros() {
    this.http.get<any>(`${this.apiUrl}?action=list`).subscribe(response => {
      if (response.success) {
        this.registros = response.data;
      } else {
        console.error('Error al cargar registros:', response.message);
      }
    });
  }
  cargarEnFormulario(reg: any) {
    this.carga = { ...reg };  // copiamos los datos al formulario
  
    // Guardamos el HBL_HAWB original (para saber qué registro estamos editando)
    this.HBL_HAWB_original = reg.HBL_HAWB;
  
    // Cambiamos el modo del botón
    this.modoEdicion = true;
  }
  limpiarFormulario() {
    this.carga = {
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
    this.modoEdicion = false;
    this.HBL_HAWB_original = '';
  }
  abrirModal() {
    this.mostrarModal = true;
  }
  cerrarModal() {
    this.mostrarModal = false;
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
