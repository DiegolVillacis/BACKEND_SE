import express,{Application} from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import compression from 'compression';
import helmet from 'helmet';

import authRoutes from './userRoutes';
import votoRoutes from './votoBlockRoutes';
import listaRoutes from './listaVotacionRoutes';
import candidatosRoutes from './candidatosRoutes';
import votacionesRoutes from './votacionesRoutes';
import seguridadRoutes from './operacionesRoutes';
import procesosRoutes from "./procesosRoutes";


const fileUpload = require('express-fileupload');

const app: Application = express();

// settings
app.set('port', process.env.PORT || 3001);

// middlewares
app.use(morgan('dev'));
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
// app.use(express.raw({ type: 'image/*', limit: '2Mb'}));
app.use(fileUpload({
    useTempFiles: true,
    limits: { fileSize: 50 * 1024 * 1024 },
    uploadTimeout: 60000
}));

// routes   
app.use('/api/user', authRoutes);
app.use('/api/candidatos', candidatosRoutes);
app.use('/api/listaVotacion', listaRoutes);
app.use('/api/votaciones', votacionesRoutes);
app.use('/api/votoblock', votoRoutes);

app.use('/api/procesos', procesosRoutes);

app.use('/api/operaciones', seguridadRoutes);




// la carpeta de usa para almacenar imagenes
app.use('/uploads', express.static(path.resolve('uploads')))

export default app;

