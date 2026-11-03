import {
  setNotificationHandler,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
  SchedulableTriggerInputTypes,
} from 'expo-notifications';
const RECORDATORIO_DEMO_SEGUNDOS = 0;

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const solicitarPermisosNotificacion = async () => {
  const { granted, canAskAgain } = await requestPermissionsAsync();
  if (!granted) {
    console.warn(`Permiso de notificaciones denegado${canAskAgain ? '' : ' (activalo en Ajustes)'}`);
  }
  return granted;
};


export const inicializarNotificaciones = async () => {
  await solicitarPermisosNotificacion();
};


export const programarNotificacionReserva = async (reserva) => {
  try {
    if (!(await solicitarPermisosNotificacion())) return;


    let fechaReservaObj;
    if (typeof reserva.fecha === 'string' && reserva.fecha.includes('/')) {
      const [dia, mes, anio] = reserva.fecha.split('/');
      fechaReservaObj = new Date(`${anio}-${mes}-${dia}T09:00:00`);
    } else {
      fechaReservaObj = new Date(reserva.fecha);
    }

    const ahora = new Date();
    const diferenciaHoras = (fechaReservaObj.getTime() - ahora.getTime()) / (1000 * 60 * 60);


    if (diferenciaHoras < 24 && RECORDATORIO_DEMO_SEGUNDOS === 0) {
      console.log('La reserva es para menos de 24 horas, no se programa notificación.');
      return;
    }

    const triggerConfig = RECORDATORIO_DEMO_SEGUNDOS > 0
      ? { type: SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: RECORDATORIO_DEMO_SEGUNDOS }
      : { type: SchedulableTriggerInputTypes.DATE, date: new Date(fechaReservaObj.getTime() - (24 * 60 * 60 * 1000)) };

    await scheduleNotificationAsync({
      identifier: `reserva-${reserva.id}`,
      content: {
        title: 'Recordatorio de Reserva',
        body: `Te recordamos tu reserva para el servicio: ${reserva.servicio?.nombre || 'Servicio'}`,
      },
      trigger: triggerConfig,
    });
  } catch (err) {
    console.warn('No se pudo programar la notificación:', err);
  }
};


export const cancelarNotificacionReserva = async (reservaId) => {
  try {
    await cancelScheduledNotificationAsync(`reserva-${reservaId}`);
  } catch (err) {
    console.warn('No se pudo cancelar la notificación:', err);
  }
};