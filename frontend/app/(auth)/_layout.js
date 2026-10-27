import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function AuthLayout() {
  const { token, cargando } = useAuth();

  
  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  
  if (token) {
    return <Redirect href="/servicios" />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: 'Iniciar sesion' }} />
      <Stack.Screen name="registro" options={{ title: 'Crear cuenta' }} />
    </Stack>
  );
}