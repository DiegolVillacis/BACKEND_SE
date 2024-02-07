import { Router } from 'express';
const router: Router = Router();

import * as PROCESO from '../controllers/votacionesControllers';
import { tokenGenerate } from "../security/tokenBlock";

router.post('/registrar-proceso', tokenGenerate, PROCESO.registerVotacion);
router.put('/update-proceso', tokenGenerate, PROCESO.updateVotacion);
router.get('/ver-registros', tokenGenerate, PROCESO.getVotaciones);
router.get('/proceso-actual', tokenGenerate, PROCESO.getVotacionesUser);

export default router;  