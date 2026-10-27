import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { obtenerServicios } from '../../../services/servicios.service';
import estilos from '../../../styles/estilos';
import type { Servicio } from '../../../lib/tipos';

export default function DetalleServicio() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { usuario } = useAuth();

  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const servicios: Servicio[] = await obtenerServicios();
        const encontrado = servicios.find((s) => String(s.id) === String(id));

        if (encontrado) {
          setServicio(encontrado);
        } else {
          setError('Servicio no encontrado');
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id]);

  
  if (usuario?.rol !== 'cliente') {
    return <Redirect href="/servicios" />;
  }

  if (cargando) {
    return (
      <View style={[estilos.contenedor, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !servicio) {
    return (
      <View style={estilos.contenedor}>
        <Text style={estilos.error}>{error || 'Servicio no encontrado'}</Text>
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>{servicio.nombre}</Text>
      <Text style={estilos.descripcion}>{servicio.descripcion}</Text>

      <Text style={estilos.tarjetaDato}>Duración: {servicio.duracion} min</Text>
      <Text style={[estilos.tarjetaDato, { marginBottom: 20 }]}>Precio: ${servicio.precio}</Text>

      <TouchableOpacity
        style={estilos.boton}
        onPress={() =>
          router.push({
            pathname: '/reservas/nueva',
            params: {
              servicioId: String(servicio.id),
              nombre: servicio.nombre,
              duracion: String(servicio.duracion),
              precio: String(servicio.precio),
            },
          })
        }
      >
        <Text style={estilos.botonTexto}>Reservar</Text>
      </TouchableOpacity>
    </View>
  );
}