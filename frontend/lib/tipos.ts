export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
}

export interface Reserva {
  id: number;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'completada' | 'cancelada';
  servicio: Servicio;
}