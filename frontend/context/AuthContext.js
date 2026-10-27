import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAlExpirarSesion } from '../services/api';
import { iniciarSesion } from '../services/auth.service';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true); 

  useEffect(() => {
    
    async function cargarSesion() {
      try {
        const tokenGuardado = await AsyncStorage.getItem('token');
        const usuarioGuardado = await AsyncStorage.getItem('usuario');
        if (tokenGuardado && usuarioGuardado) {
          setToken(tokenGuardado);
          setUsuario(JSON.parse(usuarioGuardado));
        }
      } finally {
        setCargando(false);
      }
    }
    cargarSesion();

    
    setAlExpirarSesion(logout);
  }, []);

  async function login(email, password) {
    const datos = await iniciarSesion(email, password);
    await AsyncStorage.setItem('token', datos.token);
    await AsyncStorage.setItem('usuario', JSON.stringify(datos.usuario));
    setToken(datos.token);
    setUsuario(datos.usuario);
  }

  async function logout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ token, usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}