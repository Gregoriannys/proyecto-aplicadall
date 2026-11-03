import express from 'express';
import verificarToken from '../middlewares/auth.js';
import soloAdmin from '../middlewares/soloAdmin.js';
import { listar, crear, editar, eliminar, actualizarPerfil } from '../controllers/servicios.controller.js';

const router = express.Router();


router.get('/', verificarToken, listar);


router.post('/', verificarToken, soloAdmin, crear);
router.put('/:id', verificarToken, soloAdmin, editar);
router.delete('/:id', verificarToken, soloAdmin, eliminar);
router.put('/usuarios/perfil', verificarToken, actualizarPerfil)

export default router;