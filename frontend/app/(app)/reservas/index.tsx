import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Redirect, useFocusEffect } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { obtenerMisReservas, cancelarReserva } from '../../../features/reservas/reservas.service';
import estilos from '../../../styles/estilos';
import type { Reserva } from '../../../lib/tipos';


const estiloEstado = {
  pendiente: estilos.estadoPendiente,
  completada: estilos.estadoCompletada,
  cancelada: estilos.estadoCancelada,
};

export default function MisReservas() {
  const { usuario } = useAuth();

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function cargarReservas() {
    setCargando(true);
    setError('');
    try {
      const datos: Reserva[] = await obtenerMisReservas();
      setReservas(datos);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  }

  
  useFocusEffect(
    useCallback(() => {
      cargarReservas();
    }, [])
  );

  
  function confirmarCancelar(reserva: Reserva) {
    Alert.alert(
      'Cancelar reserva',
      `¿Cancelar tu reserva de "${reserva.servicio.nombre}" del ${reserva.fecha}?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí, cancelar', style: 'destructive', onPress: () => cancelar(reserva.id) },
      ]
    );
  }

  async function cancelar(id: number) {
    setCargando(true);
    setError('');
    try {
      await cancelarReserva(id);
      await cargarReservas(); 
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
      {cargando ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={estilos.error}>{error}</Text>
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={<Text>Aun no tienes reservas.</Text>}
          renderItem={({ item }) => (
            <View style={estilos.tarjeta}>
              <Text style={estilos.tarjetaNombre}>{item.servicio.nombre}</Text>
              <Text style={estilos.tarjetaDato}>Fecha: {item.fecha}</Text>
              <Text style={estilos.tarjetaDato}>Hora: {item.hora}</Text>
              <Text style={[estilos.estado, estiloEstado[item.estado]]}>
                Estado: {item.estado}
              </Text>

              
              {item.estado === 'pendiente' && (
                <View style={[estilos.fila, { marginTop: 10, marginBottom: 0 }]}>
                  <TouchableOpacity
                    style={[estilos.botonPequeno, estilos.botonPeligro]}
                    onPress={() => confirmarCancelar(item)}
                  >
                    <Text style={estilos.botonTexto}>Cancelar reserva</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}