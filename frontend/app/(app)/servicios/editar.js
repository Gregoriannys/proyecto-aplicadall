import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { editarServicio } from '../../../services/servicios.service';
import estilos from '../../../styles/estilos';

export default function EditarServicio() {
  const router = useRouter();
  const { usuario } = useAuth();

  
  const params = useLocalSearchParams();

  const [nombre, setNombre] = useState(params.nombre ?? '');
  const [descripcion, setDescripcion] = useState(params.descripcion ?? '');
  const [duracion, setDuracion] = useState(params.duracion ?? '');
  const [precio, setPrecio] = useState(params.precio ?? '');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function manejarGuardar() {
    setError('');

    if (!nombre || !descripcion || !duracion || !precio) {
      setError('Completa todos los campos');
      return;
    }

    setCargando(true);
    try {
      await editarServicio(params.id, {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        duracion: Number(duracion),
        precio: Number(precio),
      });
      Alert.alert('Listo', 'Servicio actualizado correctamente');
      router.back();
    } catch (e) {
      setError(e.message);
      setCargando(false);
    }
  }

  
  if (usuario?.rol !== 'admin') {
    return <Redirect href="/servicios" />;
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Editar servicio</Text>

      <TextInput
        placeholderTextColor="#6b7280"
        style={estilos.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        placeholderTextColor="#6b7280"
        style={estilos.input}
        placeholder="Descripcion"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TextInput
        placeholderTextColor="#6b7280"
        style={estilos.input}
        placeholder="Duracion (minutos)"
        value={duracion}
        onChangeText={setDuracion}
        keyboardType="numeric"
      />
      <TextInput
        placeholderTextColor="#6b7280"
        style={estilos.input}
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />

      {error ? <Text style={estilos.error}>{error}</Text> : null}

      {cargando ? (
        <ActivityIndicator size="large" />
      ) : (
        <TouchableOpacity style={estilos.boton} onPress={manejarGuardar}>
          <Text style={estilos.botonTexto}>Guardar cambios</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}