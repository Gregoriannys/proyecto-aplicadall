import prisma from '../config/prisma.js';


function validarServicio({ nombre, descripcion, duracion, precio }) {
  if (!nombre || !descripcion) {
    return 'Nombre y descripcion son obligatorios';
  }
  if (!Number.isInteger(Number(duracion)) || Number(duracion) <= 0) {
    return 'La duracion debe ser un numero entero de minutos mayor a 0';
  }
  if (isNaN(Number(precio)) || Number(precio) < 0) {
    return 'El precio debe ser un numero valido';
  }
  return null;
}


export async function listar(req, res) {
  try {
    const servicios = await prisma.servicio.findMany({ orderBy: { id: 'asc' } });
    res.json(servicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}


export async function crear(req, res) {
  try {
    const errorValidacion = validarServicio(req.body);
    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
    }

    const { nombre, descripcion, duracion, precio } = req.body;

    const servicio = await prisma.servicio.create({
      data: {
        nombre,
        descripcion,
        duracion: Number(duracion),
        precio: Number(precio),
      },
    });

    res.status(201).json(servicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}


export async function editar(req, res) {
  try {
    const id = Number(req.params.id);

    const errorValidacion = validarServicio(req.body);
    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
    }

    const existe = await prisma.servicio.findUnique({ where: { id } });
    if (!existe) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    const { nombre, descripcion, duracion, precio } = req.body;

    const servicio = await prisma.servicio.update({
      where: { id },
      data: {
        nombre,
        descripcion,
        duracion: Number(duracion),
        precio: Number(precio),
      },
    });

    res.json(servicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}


export async function eliminar(req, res) {
  try {
    const id = Number(req.params.id);

    const existe = await prisma.servicio.findUnique({ where: { id } });
    if (!existe) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    await prisma.servicio.delete({ where: { id } });
    res.json({ mensaje: 'Servicio eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}