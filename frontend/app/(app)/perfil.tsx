import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { peticion } from '../../services/api';

export default function PerfilScreen() {
  const { usuario, logout, actualizarUsuario } = useAuth();

  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const inicial = (usuario?.nombre || '?').trim().charAt(0).toUpperCase();
  const etiquetaRol = usuario?.rol === 'admin' ? 'Administrador' : 'Cliente';
  const sinCambios = nombre.trim() === (usuario?.nombre || '');

  async function guardar() {
    setError('');

    if (!nombre.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }

    setCargando(true);
    try {
      const respuesta = await (peticion as any)('/usuarios/perfil', 'PUT', {
        nombre: nombre.trim(),
      });
      const usuarioActualizado = respuesta.usuario || respuesta;

      await actualizarUsuario(usuarioActualizado);
      Alert.alert('Listo', 'Perfil actualizado correctamente');
    } catch (e) {
      setError((e as Error).message || 'No se pudo actualizar el perfil');
    } finally {
      setCargando(false);
    }
  }

  
  async function cerrarSesion() {
    await logout();
  }

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
      keyboardShouldPersistTaps="handled"
    >
      
      <View style={styles.cabecera}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{inicial}</Text>
        </View>
        <Text style={styles.nombreGrande}>{usuario?.nombre}</Text>
        <View style={styles.insignia}>
          <Text style={styles.insigniaTexto}>{etiquetaRol}</Text>
        </View>
      </View>

      
      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>Correo electrónico</Text>
        <View style={styles.campoBloqueado}>
          <Text style={styles.campoBloqueadoTexto}>{usuario?.email}</Text>
          <Ionicons name="lock-closed-outline" size={18} color="#6b7280" />
        </View>
        <Text style={styles.ayuda}>El correo no se puede cambiar.</Text>

        <Text style={[styles.etiqueta, { marginTop: 16 }]}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Tu nombre"
          placeholderTextColor="#6b7280"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {cargando ? (
          <ActivityIndicator size="large" style={{ marginTop: 8 }} />
        ) : (
          <TouchableOpacity
            style={[styles.botonGuardar, sinCambios && styles.botonDeshabilitado]}
            onPress={guardar}
            disabled={sinCambios}
          >
            <Text style={styles.botonGuardarTexto}>Guardar cambios</Text>
          </TouchableOpacity>
        )}
      </View>

      
      <TouchableOpacity style={styles.botonCerrar} onPress={cerrarSesion}>
        <Ionicons name="log-out-outline" size={20} color="#dc2626" />
        <Text style={styles.botonCerrarTexto}>Cerrar sesion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#f3f4f6' },
  contenido: { padding: 20, paddingBottom: 40 },

  cabecera: { alignItems: 'center', marginTop: 8, marginBottom: 24 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarTexto: { color: '#fff', fontSize: 38, fontWeight: 'bold' },
  nombreGrande: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  insignia: {
    marginTop: 6,
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  insigniaTexto: { color: '#1d4ed8', fontSize: 13, fontWeight: '600' },

  tarjeta: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  etiqueta: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  campoBloqueado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  campoBloqueadoTexto: { fontSize: 16, color: '#4b5563' },
  ayuda: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  error: { color: '#dc2626', marginBottom: 10 },

  botonGuardar: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonDeshabilitado: { opacity: 0.45 },
  botonGuardarTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  botonCerrar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#dc2626',
    backgroundColor: '#fff',
  },
  botonCerrarTexto: { color: '#dc2626', fontSize: 16, fontWeight: 'bold' },
});