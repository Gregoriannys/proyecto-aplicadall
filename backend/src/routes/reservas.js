import express from 'express';
import verificarToken from '../middlewares/auth.js';
import soloAdmin from '../middlewares/soloAdmin.js';
import {
  crear,
  misReservas,
  listarTodas,
  cambiarEstado,
  cancelar,
} from '../controllers/reservasController.js';

const router = express.Router();


router.post('/', verificarToken, crear);
router.get('/mis-reservas', verificarToken, misReservas);
router.delete('/:id', verificarToken, cancelar);


router.get('/', verificarToken, soloAdmin, listarTodas);
router.put('/:id/estado', verificarToken, soloAdmin, cambiarEstado);

export default router;