import { peticion } from '../../services/api';

export function crearReserva(datos) {
  return peticion('/reservas', 'POST', datos);
}

export function obtenerMisReservas() {
  return peticion('/reservas/mis-reservas');
}

export function cancelarReserva(id) {
  return peticion(`/reservas/${id}`, 'DELETE');
}