import { peticion } from './api';

export function obtenerServicios() {
  return peticion('/servicios');
}

export function crearServicio(servicio) {
  return peticion('/servicios', 'POST', servicio);
}

export function editarServicio(id, servicio) {
  return peticion(`/servicios/${id}`, 'PUT', servicio);
}

export function eliminarServicio(id) {
  return peticion(`/servicios/${id}`, 'DELETE');
}