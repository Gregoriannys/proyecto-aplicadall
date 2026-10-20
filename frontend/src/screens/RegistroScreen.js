import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { registrar } from '../services/auth.service';
import estilos from '../styles/estilos';

export default function RegistroScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('cliente');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function manejarRegistro() {
    setError('');

    if (!nombre || !email || !password) {
      setError('Completa todos los campos');
      return;
    }

    setCargando(true);
    try {
      
      await registrar(nombre.trim(), email.trim(), password, rol);
      Alert.alert('Listo', 'Cuenta creada. Ahora inicia sesion.');
      navigation.navigate('Login');
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Crear cuenta</Text>

      <TextInput placeholderTextColor="#6b7280"
        style={estilos.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput placeholderTextColor="#6b7280"
        style={estilos.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput placeholderTextColor="#6b7280"
        style={estilos.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={{ marginBottom: 8 }}>Tipo de cuenta:</Text>
      <View style={estilos.fila}>
        <TouchableOpacity
          style={[estilos.opcion, rol === 'cliente' && estilos.opcionActiva]}
          onPress={() => setRol('cliente')}
        >
          <Text style={rol === 'cliente' ? estilos.opcionTextoActivo : estilos.opcionTexto}>
            Cliente
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.opcion, rol === 'admin' && estilos.opcionActiva]}
          onPress={() => setRol('admin')}
        >
          <Text style={rol === 'admin' ? estilos.opcionTextoActivo : estilos.opcionTexto}>
            Admin
          </Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={estilos.error}>{error}</Text> : null}

      {cargando ? (
        <ActivityIndicator size="large" />
      ) : (
        <TouchableOpacity style={estilos.boton} onPress={manejarRegistro}>
          <Text style={estilos.botonTexto}>Registrarme</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={estilos.enlace}>¿Ya tienes cuenta? Inicia sesion</Text>
      </TouchableOpacity>
    </View>
  );
}