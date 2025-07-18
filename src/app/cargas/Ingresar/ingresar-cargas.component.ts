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
  mostrarModal: boolean = false;
  apiUrl = 'https://www.broomperu.com/BroomPeru/API/cargaRegistros.php';

  userProfile: string = '';
  registros: any[] = [];
  filtroTexto: string = '';
  paginaActual: number = 1;
  registrosPorPagina: number = 10;
  ordenColumna: string = '';
  ordenAscendente: boolean = true;

  opcionesCantidad: number[] = [10, 25, 50, 100];
  
  campos = [
    { label: 'MES', key: 'MES' },
    { label: 'COM', key: 'COM' },
    { label: 'NRO_OP', key: 'NRO_OP' },
    { label: 'TARIFA', key: 'TARIFA' },
    { label: 'COD_SAP', key: 'COD_SAP' },
    { label: 'STATUS', key: 'STATUS' },
    { label: 'TIPO', key: 'TIPO' },
    { label: 'SERVICIO', key: 'SERVICIO' },
    { label: 'UTILIDAD', key: 'UTILIDAD' },
    { label: 'RUC', key: 'RUC' },
    { label: 'AGENTE', key: 'AGENTE' },
    { label: 'SHIPPER', key: 'SHIPPER' },
    { label: 'CONSIGNEE', key: 'CONSIGNEE' },
    { label: 'MBL_MAWB', key: 'MBL_MAWB' },
    { label: 'HBL_HAWB', key: 'HBL_HAWB' },
    { label: 'WEEK', key: 'WEEK' },
    { label: 'PUERTO_DE_EMBARQUE', key: 'PUERTO_DE_EMBARQUE' },
    { label: 'ATD', key: 'ATD' },
    { label: 'PUERTO_TRANSBORDO', key: 'PUERTO_TRANSBORDO' },
    { label: 'FECHA_ARRIBO_TRANSBORDO', key: 'FECHA_ARRIBO_TRANSBORDO' },
    { label: 'FECHA_SALIDA_TRANSBORDO', key: 'FECHA_SALIDA_TRANSBORDO' },
    { label: 'PUERTO_DE_DESCARGA', key: 'PUERTO_DE_DESCARGA' },
    { label: 'ATA', key: 'ATA' },
    { label: 'NAVIERA_COLOADER', key: 'NAVIERA_COLOADER' },
    { label: 'COND', key: 'COND' },
    { label: 'NUMERO_CONTS', key: 'NUMERO_CONTS' },
    { label: 'CANT', key: 'CANT' },
    { label: 'SIZE', key: 'SIZE' },
    { label: 'TYPE', key: 'TYPE' },
    { label: 'KILOS', key: 'KILOS' },
    { label: 'NAVE', key: 'NAVE' },
    { label: 'VIAJE', key: 'VIAJE' },
    { label: 'PUERTO_ATRAQUE', key: 'PUERTO_ATRAQUE' },
    { label: 'DT', key: 'DT' },
    { label: 'ADUANA_MANIF', key: 'ADUANA_MANIF' },
    { label: 'NRO_MANIFIESTO', key: 'NRO_MANIFIESTO' },
    { label: 'DAM', key: 'DAM' },
    { label: 'FECHA_REGULARIZADA', key: 'FECHA_REGULARIZADA' },
    { label: 'NRO_TICKET', key: 'NRO_TICKET' },
    { label: 'FECHA_HORA_TRANSMISION', key: 'FECHA_HORA_TRANSMISION' },
    { label: 'COMENTARIOS', key: 'COMENTARIOS' },
    //{ label: 'RUT', key: 'RUT' }
  ];

  carga: any = {};

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      const userObj = JSON.parse(user);
      this.userProfile = userObj.rol;
    }
    this.limpiarFormulario();
  }

  ngOnInit(): void {
    this.cargarRegistros();
  }

  guardarRegistro() {
    if (!this.carga.HBL_HAWB || this.carga.HBL_HAWB.trim() === '') {
      alert('El campo HBL/HAWB no puede estar vacío.');
      return;
    }

    const bodyInsert = {
      ...this.carga,
      FECHA_REGULARIZADA: this.convertirAFormatoOriginal(this.carga.FECHA_REGULARIZADA),
      FECHA_HORA_TRANSMISION: this.convertirAFormatoOriginal(this.carga.FECHA_HORA_TRANSMISION)
    };

    this.http.post<any>(`${this.apiUrl}?action=insert`, bodyInsert).subscribe(response => {
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

  convertirAFormatoOriginal(datetimeStr: string): string {
    if (!datetimeStr || !datetimeStr.includes('T')) return '';
    return datetimeStr.replace('T', ' ');
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

  limpiarFormulario() {
    this.carga = {};
    for (const campo of this.campos) {
      this.carga[campo.key] = campo.key === 'NUMERO_CONTS' || campo.key === 'CANT' || campo.key === 'KILOS' ? 0 : '';
    }
    this.modoEdicion = false;
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

    const columnas = this.campos.map(c => c.key);

    const csvContent = [
      columnas.join(','),
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
  obtenerValoresPorCampo(campo: string): string[] {
    switch (campo) {
      case 'MES':
        return ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SETIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
      case 'COM':
        return ['AGENTE', 'BGL'];
      case 'STATUS':
        return ['EN CURSO', 'CERRADO'];
      case 'TIPO':
        return ['EXPO', 'IMPO'];
      case 'SERVICIO':
        return ['ALM', 'COURIER', 'FWD', 'FWD / SLI', 'SLI'];
      case 'COND.':
        return ['AIR', 'DEP', 'FCL', 'LCL'];
      default:
        return [];
    }
  }
  
}
