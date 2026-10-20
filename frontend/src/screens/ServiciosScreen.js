import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { obtenerServicios, eliminarServicio } from '../services/servicios.service';
import estilos from '../styles/estilos';

export default function ServiciosScreen({ navigation }) {
  const { usuario, logout } = useAuth();

  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const esAdmin = usuario?.rol === 'admin';

  async function cargarServicios() {
    setCargando(true);
    setError('');
    try {
      const datos = await obtenerServicios();
      setServicios(datos);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  
  useFocusEffect(
    useCallback(() => {
      cargarServicios();
    }, [])
  );

  
  function confirmarEliminar(servicio) {
    Alert.alert(
      'Eliminar servicio',
      `¿Seguro que quieres eliminar "${servicio.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => eliminar(servicio.id) },
      ]
    );
  }

  async function eliminar(id) {
    setCargando(true);
    setError('');
    try {
      await eliminarServicio(id);
      await cargarServicios(); 
    } catch (e) {
      setError(e.message);
      setCargando(false);
    }
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={{ marginBottom: 12 }}>
        Hola, {usuario?.nombre} ({usuario?.rol})
      </Text>

      
      {esAdmin && (
        <TouchableOpacity
          style={[estilos.boton, { marginBottom: 12 }]}
          onPress={() => navigation.navigate('CrearServicio')}
        >
          <Text style={estilos.botonTexto}>+ Crear servicio</Text>
        </TouchableOpacity>
      )}

      {cargando ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={estilos.error}>{error}</Text>
      ) : (
        <FlatList
          data={servicios}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={<Text>No hay servicios disponibles.</Text>}
          renderItem={({ item }) => (
            <View style={estilos.tarjeta}>
              <Text style={estilos.tarjetaNombre}>{item.nombre}</Text>
              <Text style={estilos.tarjetaDato}>Duración: {item.duracion} min</Text>
              <Text style={estilos.tarjetaDato}>Precio: ${item.precio}</Text>

              
              {esAdmin && (
                <View style={[estilos.fila, { marginTop: 10, marginBottom: 0 }]}>
                  <TouchableOpacity
                    style={estilos.botonPequeno}
                    onPress={() => navigation.navigate('EditarServicio', { servicio: item })}
                  >
                    <Text style={estilos.botonTexto}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[estilos.botonPequeno, estilos.botonPeligro]}
                    onPress={() => confirmarEliminar(item)}
                  >
                    <Text style={estilos.botonTexto}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}

      <TouchableOpacity style={[estilos.boton, estilos.botonSecundario]} onPress={logout}>
        <Text style={estilos.botonTexto}>Cerrar sesion</Text>
      </TouchableOpacity>
    </View>
  );
}