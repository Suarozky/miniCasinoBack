import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import protectedRoutes from './routes/protectedRoutes';


const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Configuración de Morgan para registrar las solicitudes HTTP
app.use(morgan('dev')); // Puedes cambiar 'dev' por otro formato como 'combined'

app.use('/auth', authRoutes);
// Rutas protegidas
app.use('/api', protectedRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
