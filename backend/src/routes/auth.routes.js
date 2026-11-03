import express from 'express';
import { registro, login, perfil } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', perfil);

export default router;