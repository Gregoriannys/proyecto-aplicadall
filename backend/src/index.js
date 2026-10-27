import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import serviciosRoutes from './routes/servicios.routes.js';
import reservasRoutes from './routes/reservas.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/servicios', serviciosRoutes);
app.use('/reservas', reservasRoutes);

const PORT = process.env.PORT || 3000;


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});