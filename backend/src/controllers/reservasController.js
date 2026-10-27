import prisma from '../config/prisma.js';

const ESTADOS = ['pendiente', 'completada', 'cancelada'];


const ZONA_HORARIA = '-04:00';


function aFechaISO(fecha) {
  const partes = fecha.split('/'); 
  if (partes.length !== 3) return null;

  const [dia, mes, anio] = partes;
  if (dia.length !== 2 || mes.length !== 2 || anio.length !== 4) return null;

  return `${anio}-${mes}-${dia}`;
}


function horaValida(hora) {
  const partes = hora.split(':'); 
  if (partes.length !== 2) return false;

  const [horas, minutos] = partes;
  return (
    horas.length === 2 &&
    minutos.length === 2 &&
    Number(horas) >= 0 && Number(horas) <= 23 &&
    Number(minutos) >= 0 && Number(minutos) <= 59
  );
}


function aFechaRD(fecha) {
  const [anio, mes, dia] = fecha.toISOString().slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}


function darFormato(reserva) {
  return { ...reserva, fecha: aFechaRD(reserva.fecha) };
}


export async function crear(req, res) {
  try {
    if (req.usuario.rol !== 'cliente') {
      return res.status(403).json({ mensaje: 'Solo los clientes pueden hacer reservas' });
    }

    const { servicioId, fecha, hora } = req.body;

    if (!servicioId || !fecha || !hora) {
      return res.status(400).json({ mensaje: 'Servicio, fecha y hora son obligatorios' });
    }

    const fechaISO = aFechaISO(String(fecha));
    if (!fechaISO || !horaValida(String(hora))) {
      return res.status(400).json({
        mensaje: 'Para la fecha (ej. 15/12/2026) y para la hora (ej. 14:30)',
      });
    }

    
    const momento = new Date(`${fechaISO}T${hora}:00${ZONA_HORARIA}`);
    if (isNaN(momento.getTime())) {
      return res.status(400).json({ mensaje: 'La fecha u hora no es valida' });
    }
    if (momento < new Date()) {
      return res.status(400).json({ mensaje: 'No se puede reservar en una fecha pasada' });
    }

    const servicio = await prisma.servicio.findUnique({ where: { id: Number(servicioId) } });
    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    
    const reserva = await prisma.reserva.create({
      data: {
        fecha: new Date(`${fechaISO}T00:00:00.000Z`),
        hora,
        usuarioId: req.usuario.id,
        servicioId: servicio.id,
      },
      include: { servicio: true },
    });

    res.status(201).json(darFormato(reserva));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}


export async function misReservas(req, res) {
  try {
    const reservas = await prisma.reserva.findMany({
      where: { usuarioId: req.usuario.id },
      include: { servicio: true },
      orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
    });
    res.json(reservas.map(darFormato));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}


export async function listarTodas(req, res) {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        servicio: true,
        usuario: { select: { id: true, nombre: true, email: true } },
      },
      orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
    });
    res.json(reservas.map(darFormato));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}


export async function cambiarEstado(req, res) {
  try {
    const id = Number(req.params.id);
    const { estado } = req.body;

    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({ mensaje: 'Estado no valido. Usa: pendiente, completada o cancelada' });
    }

    const existe = await prisma.reserva.findUnique({ where: { id } });
    if (!existe) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    const reserva = await prisma.reserva.update({
      where: { id },
      data: { estado },
      include: { servicio: true },
    });

    res.json(darFormato(reserva));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}


export async function cancelar(req, res) {
  try {
    const id = Number(req.params.id);

    const reserva = await prisma.reserva.findUnique({ where: { id } });
    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    
    if (reserva.usuarioId !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No puedes cancelar una reserva que no es tuya' });
    }

    
    if (reserva.estado !== 'pendiente') {
      return res.status(400).json({ mensaje: 'Solo se pueden cancelar reservas pendientes' });
    }

    await prisma.reserva.update({ where: { id }, data: { estado: 'cancelada' } });

    res.json({ mensaje: 'Reserva cancelada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}