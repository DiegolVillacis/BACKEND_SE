import { Router } from 'express';
const router: Router = Router();

import { obtenerMenu, obtenerTransaccion, obtenerRol, mantenimientoMenu, mantenimientoTransaccion, mantenimientoRol } from '../controllers/operacionesControllers';
import { tokenGenerate } from "../security/tokenBlock";

router.post('/menu', tokenGenerate, mantenimientoMenu);
router.get('/menu', tokenGenerate, obtenerMenu);
router.post('/transaccion', tokenGenerate, mantenimientoTransaccion);
router.get('/transaccion', tokenGenerate, obtenerTransaccion);
router.post('/rol', tokenGenerate, mantenimientoRol);
router.get('/rol', tokenGenerate, obtenerRol);

export default router;