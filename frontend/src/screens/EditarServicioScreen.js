import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { editarServicio } from '../services/servicios.service';
import estilos from '../styles/estilos';

export default function EditarServicioScreen({ route, navigation }) {
  
  const { servicio } = route.params;

  const [nombre, setNombre] = useState(servicio.nombre);
  const [descripcion, setDescripcion] = useState(servicio.descripcion);
  const [duracion, setDuracion] = useState(String(servicio.duracion));
  const [precio, setPrecio] = useState(String(servicio.precio));
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
      await editarServicio(servicio.id, {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        duracion: Number(duracion),
        precio: Number(precio),
      });
      Alert.alert('Listo', 'Servicio actualizado correctamente');
      navigation.goBack();
    } catch (e) {
      setError(e.message);
      setCargando(false);
    }
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
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TextInput
        placeholderTextColor="#6b7280"
        style={estilos.input}
        placeholder="Duración (minutos)"
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