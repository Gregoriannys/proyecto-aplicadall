import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { crearServicio } from '../services/servicios.service';
import estilos from '../styles/estilos';

export default function CrearServicioScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [duracion, setDuracion] = useState('');
  const [precio, setPrecio] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function manejarCrear() {
    setError('');

    if (!nombre || !descripcion || !duracion || !precio) {
      setError('Completa todos los campos');
      return;
    }

    setCargando(true);
    try {
      await crearServicio({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        duracion: Number(duracion),
        precio: Number(precio),
      });
      Alert.alert('Listo', 'Servicio creado correctamente');
      navigation.goBack();
    } catch (e) {
      setError(e.message);
      setCargando(false);
    }
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Nuevo servicio</Text>

      <TextInput placeholderTextColor="#6b7280"
        style={estilos.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput placeholderTextColor="#6b7280"
        style={estilos.input}
        placeholder="Descripcion"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TextInput placeholderTextColor="#6b7280"
        style={estilos.input}
        placeholder="Duracion (minutos)"
        value={duracion}
        onChangeText={setDuracion}
        keyboardType="numeric"
      />
      <TextInput placeholderTextColor="#6b7280"
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
        <TouchableOpacity style={estilos.boton} onPress={manejarCrear}>
          <Text style={estilos.botonTexto}>Guardar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}