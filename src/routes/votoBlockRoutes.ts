import { Router } from 'express';
const router: Router = Router();

import { registrarVoto, verVotos } from '../controllers/votoBlockControllers';
import { tokenGenerate } from "../security/tokenBlock";

router.post('/registrar', tokenGenerate, registrarVoto);
router.get('/ver',tokenGenerate, verVotos);

export default router;