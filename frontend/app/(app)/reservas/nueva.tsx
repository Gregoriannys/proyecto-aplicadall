import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { crearReserva } from '../../../features/reservas/reservas.service';
import { mascaraFecha, mascaraHora } from '../../../lib/fechas';
import estilos from '../../../styles/estilos';

export default function NuevaReserva() {
  const router = useRouter();
  const { usuario } = useAuth();

  
  const { servicioId, nombre, duracion, precio } = useLocalSearchParams<{
    servicioId: string;
    nombre: string;
    duracion: string;
    precio: string;
  }>();

  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function manejarReservar() {
    setError('');

    if (!fecha || !hora) {
      setError('Escribe la fecha y la hora');
      return;
    }

    setCargando(true);
    try {
      await crearReserva({ servicioId: Number(servicioId), fecha, hora });
      Alert.alert('Listo', 'Reserva creada. Quedo en estado pendiente.');
      
     router.dismissAll();
      router.push('/reservas');
    } catch (e) {
      setError((e as Error).message);
      setCargando(false);
    }
  }

  
  if (usuario?.rol !== 'cliente') {
    return <Redirect href="/servicios" />;
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Nueva reserva</Text>
      <Text style={estilos.descripcion}>
        {nombre} ({duracion} min, ${precio})
      </Text>

      <Text style={estilos.etiqueta}>Fecha</Text>
      <TextInput
        placeholderTextColor="#6b7280"
        style={estilos.input}
        placeholder="Ej. 15/12/2026"
        value={fecha}
        onChangeText={(texto) => setFecha(mascaraFecha(texto))}
        keyboardType="numeric"
        maxLength={10}
      />

      <Text style={estilos.etiqueta}>Hora</Text>
      <TextInput
        placeholderTextColor="#6b7280"
        style={estilos.input}
        placeholder="Ej. 14:30"
        value={hora}
        onChangeText={(texto) => setHora(mascaraHora(texto))}
        keyboardType="numeric"
        maxLength={5}
      />

      {error ? <Text style={estilos.error}>{error}</Text> : null}

      {cargando ? (
        <ActivityIndicator size="large" />
      ) : (
        <TouchableOpacity style={estilos.boton} onPress={manejarReservar}>
          <Text style={estilos.botonTexto}>Confirmar reserva</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}