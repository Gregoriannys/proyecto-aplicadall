import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { obtenerServicios, eliminarServicio } from '../../../services/servicios.service';
import estilos from '../../../styles/estilos';
import type { Servicio } from '../../../lib/tipos';

export default function Servicios() {
  const router = useRouter();
  const { usuario, logout } = useAuth();

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const esAdmin = usuario?.rol === 'admin';
  const esCliente = usuario?.rol === 'cliente';

  async function cargarServicios() {
    setCargando(true);
    setError('');
    try {
      const datos: Servicio[] = await obtenerServicios();
      setServicios(datos);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  }

  
  useFocusEffect(
    useCallback(() => {
      cargarServicios();
    }, [])
  );

  function confirmarEliminar(servicio: Servicio) {
    Alert.alert(
      'Eliminar servicio',
      `¿Seguro que quieres eliminar "${servicio.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => eliminar(servicio.id) },
      ]
    );
  }

  async function eliminar(id: number) {
    setCargando(true);
    setError('');
    try {
      await eliminarServicio(id);
      await cargarServicios();
    } catch (e) {
      setError((e as Error).message);
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
          onPress={() => router.push('/servicios/crear')}
        >
          <Text style={estilos.botonTexto}>+ Crear servicio</Text>
        </TouchableOpacity>
      )}

      
      {esCliente && (
        <TouchableOpacity
          style={[estilos.boton, { marginBottom: 12 }]}
          onPress={() => router.push('/reservas')}
        >
          <Text style={estilos.botonTexto}>Mis reservas</Text>
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
              <TouchableOpacity
                disabled={!esCliente}
                onPress={() => router.push(`/servicios/${item.id}`)}
              >
                <Text style={estilos.tarjetaNombre}>{item.nombre}</Text>
                <Text style={estilos.tarjetaDato}>Duracion: {item.duracion} min</Text>
                <Text style={estilos.tarjetaDato}>Precio: ${item.precio}</Text>
                {esCliente && (
                  <Text style={estilos.enlaceTarjeta}>Ver detalle y reservar →</Text>
                )}
              </TouchableOpacity>

              
              {esAdmin && (
                <View style={[estilos.fila, { marginTop: 10, marginBottom: 0 }]}>
                  <TouchableOpacity
                    style={estilos.botonPequeno}
                    onPress={() =>
                      router.push({
                        pathname: '/servicios/editar',
                        params: {
                          id: String(item.id),
                          nombre: item.nombre,
                          descripcion: item.descripcion,
                          duracion: String(item.duracion),
                          precio: String(item.precio),
                        },
                      })
                    }
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