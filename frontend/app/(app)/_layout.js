import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const { token, cargando } = useAuth();

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  
  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="servicios/index" options={{ title: 'Servicios' }} />
      <Stack.Screen name="servicios/[id]" options={{ title: 'Detalle del servicio' }} />
      <Stack.Screen name="servicios/crear" options={{ title: 'Crear servicio' }} />
      <Stack.Screen name="servicios/editar" options={{ title: 'Editar servicio' }} />
      <Stack.Screen name="reservas/index" options={{ title: 'Mis reservas' }} />
      <Stack.Screen name="reservas/nueva" options={{ title: 'Nueva reserva' }} />
    </Stack>
  );
}