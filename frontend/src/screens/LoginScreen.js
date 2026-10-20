import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import estilos from '../styles/estilos';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function manejarLogin() {
    setError('');

    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }

    setCargando(true);
    try {
      await login(email.trim(), password);
      
    } catch (e) {
      setError(e.message);
      setCargando(false);
    }
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Iniciar sesion</Text>

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

      {error ? <Text style={estilos.error}>{error}</Text> : null}

      {cargando ? (
        <ActivityIndicator size="large" />
      ) : (
        <TouchableOpacity style={estilos.boton} onPress={manejarLogin}>
          <Text style={estilos.botonTexto}>Entrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
        <Text style={estilos.enlace}>¿No tienes cuenta? Registrate</Text>
      </TouchableOpacity>
    </View>
  );
}