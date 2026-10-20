import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import ServiciosScreen from '../screens/ServiciosScreen';
import CrearServicioScreen from '../screens/CrearServicioScreen';
import EditarServicioScreen from '../screens/EditarServicioScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token, usuario, cargando } = useAuth();

  
  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          <>
            <Stack.Screen name="Servicios" component={ServiciosScreen} />
            {usuario?.rol === 'admin' && (
              <>
                <Stack.Screen
                  name="CrearServicio"
                  component={CrearServicioScreen}
                  options={{ title: 'Crear servicio' }}
                />
                <Stack.Screen
                  name="EditarServicio"
                  component={EditarServicioScreen}
                  options={{ title: 'Editar servicio' }}
                />
              </>
            )}
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar sesion' }} />
            <Stack.Screen name="Registro" component={RegistroScreen} options={{ title: 'Crear cuenta' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}