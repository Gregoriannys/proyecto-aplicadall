import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  boton: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonSecundario: {
    backgroundColor: '#6b7280',
  },
  enlace: {
    color: '#2563eb',
    textAlign: 'center',
    marginTop: 16,
  },
  error: {
    color: '#dc2626',
    marginBottom: 12,
  },
  tarjeta: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  tarjetaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tarjetaDato: {
    color: '#374151',
    marginTop: 4,
  },
  fila: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  opcion: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  opcionActiva: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  opcionTexto: {
    color: '#111',
  },
  opcionTextoActivo: {
    color: '#fff',
    fontWeight: 'bold',
  },

    botonPequeno: {
    flex: 1,
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonPeligro: {
    backgroundColor: '#dc2626',
  },
});