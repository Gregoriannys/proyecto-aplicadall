import express from 'express';
import { registro, login, actualizarPerfil } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/registro', registro);
router.post('/login', login);
router.put('/perfil', actualizarPerfil);

export default router;