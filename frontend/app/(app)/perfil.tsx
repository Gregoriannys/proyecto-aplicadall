import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { peticion } from '../../services/api';

export default function PerfilScreen() {
  const router = useRouter();
  const { usuario, setUsuario, setToken } = useAuth();

  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [cargando, setCargando] = useState(false);

  const handleGuardarPerfil = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    try {
      setCargando(true);

      const respuesta = await (peticion as any)('/usuarios/perfil', 'PUT', { nombre });

      const usuarioActualizado = respuesta.usuario || respuesta;


      await AsyncStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      if (setUsuario) setUsuario(usuarioActualizado);

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
    } finally {
      setCargando(false);
    }
  };

  const handleCerrarSesion = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('usuario');
      if (setToken) setToken(null);
      if (setUsuario) setUsuario(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mi Perfil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Correo Electronico:</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={usuario?.email || ''}
          editable={false}
        />

        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Tu nombre"
        />

        <TouchableOpacity
          style={styles.botonGuardar}
          onPress={handleGuardarPerfil}
          disabled={cargando}
        >
          <Text style={styles.textoBoton}>{cargando ? 'Guardando...' : 'Guardar Cambios'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botonCerrarSesion} onPress={handleCerrarSesion}>
        <Text style={styles.textoBotonCerrar}>Cerrar Sesion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center'
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff'
  },
  inputDisabled: {
    backgroundColor: '#e9ecef',
    color: '#6c757d'
  },
  botonGuardar: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  botonCerrarSesion: {
    backgroundColor: '#dc3545',
    padding: 12, borderRadius: 8,
    alignItems: 'center'
  },
  textoBotonCerrar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
});