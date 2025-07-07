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
  mostrarModal: boolean | undefined;

  apiUrl = 'https://www.broomperu.com/BroomPeru/API/cargaRegistros.php';

  carga: any = {
    carga_id: 1,
    usuario_id: 1,
    MES: '',
    COM: '',
    NRO_OP: '',
    COD_SAP: '',
    STATUS: '',
    TIPO: '',
    SERVICIO: '',
    UTILIDAD: '',
    RUC: '',
    AGENTE: '',
    SHIPPER: '',
    CONSIGNEE: '',
    MBL_MAWB: '',
    HBL_HAWB: '',
    ATD: '',
    PUERTO_TRANSBORDO: '',
    FECHA_ARRIBO_TRANSBORDO: '',
    FECHA_SALIDA_TRANSBORDO: '',
    NAVIERA_COLOADER: '',
    WEEK: '',
    ATA: '',
    COND: '',
    NUMERO_CONTS: 0,
    CANT: 0,
    SIZE: '',
    TYPE: '',
    KILOS: 0,
    NAVE: '',
    VIAJE: '',
    PUERTO_DE_EMBARQUE: '',
    PUERTO_DE_DESCARGA: '',
    PUERTO_ATRAQUE: '',
    DT: '',
    ADUANA_MANIF: '',
    NRO_MANIFIESTO: '',
    DAM: '',
    FECHA_REGULARIZADA: '',
    NRO_TICKET: '',
    FECHA_HORA_TRANSMISION: '',
    COMENTARIOS: '',
    RUT: ''
  };

  userProfile: string = '';
  registros: any[] = [];

  filtroTexto: string = '';
  paginaActual: number = 1;
  registrosPorPagina: number = 50;
  ordenColumna: string = '';
  ordenAscendente: boolean = true;

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
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
    this.carga = { ...reg };
    this.HBL_HAWB_original = reg.HBL_HAWB;
    this.modoEdicion = true;
  }

  limpiarFormulario() {
    this.carga = {
      carga_id: 1,
      usuario_id: 1,
      MES: '',
      COM: '',
      NRO_OP: '',
      COD_SAP: '',
      STATUS: '',
      TIPO: '',
      SERVICIO: '',
      UTILIDAD: '',
      RUC: '',
      AGENTE: '',
      SHIPPER: '',
      CONSIGNEE: '',
      MBL_MAWB: '',
      HBL_HAWB: '',
      ATD: '',
      PUERTO_TRANSBORDO: '',
      FECHA_ARRIBO_TRANSBORDO: '',
      FECHA_SALIDA_TRANSBORDO: '',
      NAVIERA_COLOADER: '',
      WEEK: '',
      ATA: '',
      COND: '',
      NUMERO_CONTS: 0,
      CANT: 0,
      SIZE: '',
      TYPE: '',
      KILOS: 0,
      NAVE: '',
      VIAJE: '',
      PUERTO_DE_EMBARQUE: '',
      PUERTO_DE_DESCARGA: '',
      PUERTO_ATRAQUE: '',
      DT: '',
      ADUANA_MANIF: '',
      NRO_MANIFIESTO: '',
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
    if (!this.puedeInsertar()) return;
    this.mostrarModal = true;
  }
  

  cerrarModal() {
    this.mostrarModal = false;
  }

  registrosFiltradosPaginados() {
    let datos = [...this.registros];

    if (this.filtroTexto.trim()) {
      const filtro = this.filtroTexto.toLowerCase();
      datos = datos.filter(reg =>
        Object.values(reg).some(val => val?.toString().toLowerCase().includes(filtro))
      );
    }

    if (this.ordenColumna) {
      datos.sort((a, b) => {
        const aVal = a[this.ordenColumna];
        const bVal = b[this.ordenColumna];
        return this.ordenAscendente
          ? aVal > bVal ? 1 : -1
          : aVal < bVal ? 1 : -1;
      });
    }

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
  puedeInsertar(): boolean {
    return this.userProfile === 'Administrador';
  }
  exportarDatosFiltradosCSV() {
    const datos = this.registrosFiltradosPaginados();
  
    if (!datos.length) {
      alert("No hay datos para exportar.");
      return;
    }
  
    const columnas = Object.keys(datos[0]);
  
    const csvContent = [
      columnas.join(','), // Cabecera
      ...datos.map(row => columnas.map(col => `"${(row[col] ?? '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    const ahora = new Date();
    const timestamp = ahora.toISOString().replace(/[:.]/g, '-');
    a.download = `registros_filtrados_${timestamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  
}
