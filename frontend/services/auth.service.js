import { peticion } from './api';

export function registrar(nombre, email, password, rol) {
  return peticion('/auth/registro', 'POST', { nombre, email, password, rol });
}

export function iniciarSesion(email, password) {
  return peticion('/auth/login', 'POST', { email, password });
}