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
      NRO_OP: '',
      TARIFA: '',
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
      WEEK: '',
      PUERTO_DE_EMBARQUE: '',
      ATD: '',
      PUERTO_TRANSBORDO: '',
      FECHA_ARRIBO_TRANSBORDO: '',
      FECHA_SALIDA_TRANSBORDO: '',
      PUERTO_DE_DESCARGA: '',
      ATA: '',
      NAVIERA_COLOADER: '',
      COND: '',
      NUMERO_CONTS: 0,
      CANT: 0,
      SIZE: '',
      TYPE: '',
      KILOS: 0,
      NAVE: '',
      VIAJE: '',
      PUERTO_ATRAQUE: '',
      DT: '',
      ADUANA_MANIF: '',
      NRO_MANIFIESTO: '',
      DAM: '',
      FECHA_REGULARIZADA: '',
      NRO_TICKET: '',
      FECHA_HORA_TRANSMISION: '',
      COMENTARIOS: ''
    };
    
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
      { label: 'COMENTARIOS', key: 'COMENTARIOS' }
    ];
    
    
    registros: any[] = [];
    HBL_HAWB_original: any;
    modoEdicion: boolean | undefined;
    mostrarModal: boolean | undefined;
    userProfile: any;
    userRut: any;
    
  filtroTexto: string = '';
  paginaActual: number = 1;
  registrosPorPagina: number = 10;
  ordenColumna: string = '';
  ordenAscendente: boolean = true;
  opcionesCantidad: number[] = [10, 25, 50, 100];

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
      console.log("Perfil:", this.userProfile);

}
definirColumnasPorPerfil() {
  const perfil = this.userProfile;

  const todas = {
    MES: true, COM: true, NRO_OP: true, TARIFA: true, COD_SAP: true,
    STATUS: true, TIPO: true, SERVICIO: true, UTILIDAD: true, RUC: true,
    AGENTE: true, CONSIGNEE: true, MBL_MAWB: true,
    HBL_HAWB: true, WEEK: true, PUERTO_DE_EMBARQUE: true, ATD: true,
    PUERTO_TRANSBORDO: true, FECHA_ARRIBO_TRANSBORDO: true,
    FECHA_SALIDA_TRANSBORDO: true, PUERTO_DE_DESCARGA: true, ATA: true,
    NAVIERA_COLOADER: true, COND: true, NUMERO_CONTS: true, CANT: true,
    SIZE: true, TYPE: true, KILOS: true, NAVE: true, VIAJE: true,
    PUERTO_ATRAQUE: true, DT: true, ADUANA_MANIF: true, NRO_MANIFIESTO: true,
    DAM: true, FECHA_REGULARIZADA: true, NRO_TICKET: true,
    FECHA_HORA_TRANSMISION: true, COMENTARIOS: true
  };

  const empresas = {
    NRO_OP: true,
    TIPO: true,
    RUC: true,
    SHIPPER: true, 
    CONSIGNEE: true,
    MBL_MAWB: true,
    HBL_HAWB: true,
    PUERTO_DE_EMBARQUE: true,
    ATD: true,
    PUERTO_TRANSBORDO: true,
    FECHA_ARRIBO_TRANSBORDO: true,
    FECHA_SALIDA_TRANSBORDO: true,
    PUERTO_DE_DESCARGA: true,
    ATA: true,
    COND: true,
    NUMERO_CONTS: true,
    CANT: true,
    SIZE: true,
    TYPE: true, 
    KILOS: true,
    NAVE: true,
    VIAJE: true
  };
  
  const aduanero = { ...empresas };

  if (perfil === 'Administrador') this.columnasVisibles = todas;
  else if (perfil === 'Aduana') this.columnasVisibles = aduanero;
  else if (perfil === 'Empresa') this.columnasVisibles = empresas;
}

    cargarRegistros() {
      this.http.get<any>(`${this.apiUrl}?action=list`).subscribe(response => {
        console.log("carga" +this.userProfile);

        if (response.success) {

          if (this.userProfile === 'Empresa') {
            console.log(localStorage.getItem('user'));
            const user = JSON.parse(localStorage.getItem('user')!);
            const rutUsuario = user.rut;
            console.log("usuario 1: " + user.nombre_usuario);
            // Mostrar solo registros que coinciden con su RUT
            this.registros = response.data.filter((reg: any) => reg.RUC  === user.nombre_usuario);
          } else {
            console.log("else")
            this.registros = response.data;
          }
        } else {
          console.error('Error al cargar registros:', response.message);
        }
      });
    }
    cargarEnFormulario(reg: any): void {
      console.log("Abriendo modal para:", this.userProfile);
      this.carga = { ...reg };
    
      if (this.userProfile === 'Administrador') {
        this.HBL_HAWB_original = reg.HBL_HAWB;
        this.modoEdicion = true;
      }
    
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
    console.log(bodyUpdate);
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
      const datos = this.registrosFiltrados;
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
      const total = Math.ceil(this.registrosFiltrados.length / this.registrosPorPagina);
      return Array.from({ length: total }, (_, i) => i + 1);
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
    get registrosFiltrados(): any[] {
      if (!this.filtroTexto.trim()) return this.registros;
    
      const texto = this.filtroTexto.toLowerCase();
      return this.registros.filter(reg =>
        Object.values(reg).some(val => val?.toString().toLowerCase().includes(texto))
      );
    }
   
    

    
  }
