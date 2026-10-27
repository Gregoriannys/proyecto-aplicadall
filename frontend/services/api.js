import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = Constants.expoConfig.extra.apiUrl;


let alExpirarSesion = null;

export function setAlExpirarSesion(funcion) {
  alExpirarSesion = funcion;
}

export async function peticion(ruta, metodo = 'GET', body = null) {
  const token = await AsyncStorage.getItem('token');

  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new Error('No se pudo conectar con el servidor');
  }

  const datos = await respuesta.json().catch(() => ({}));

  
  if (respuesta.status === 401 && token) {
    if (alExpirarSesion) await alExpirarSesion();
    throw new Error('Tu sesion expiro. Inicia sesion de nuevo.');
  }

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'Ocurrio un error');
  }

  return datos;
}