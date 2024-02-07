import { Router } from 'express';
const router: Router = Router();

import { tokenGenerate } from "../security/tokenBlock";
import { getListaCandidatos, createCandidato, updateCandidato } from '../controllers/candidateControllers';

router.get('/lista/:lista_candidato', tokenGenerate, getListaCandidatos);
router.get('/listae/:lista_candidato', tokenGenerate, getListaCandidatos);

router.post('/registrar', tokenGenerate, createCandidato);
router.put('/editar', tokenGenerate, updateCandidato);

export default router;
