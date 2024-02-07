import { Router } from 'express';
const router: Router = Router();

import { tokenGenerate } from "../security/tokenBlock";
import { subirImageLista, createListas, getListasElectoral, actualizarListas} from '../controllers/listVotacionesControllers';

router.get('/lista/:id_proceso', tokenGenerate, getListasElectoral);
router.post('/registrar-lista/', tokenGenerate, createListas);
router.put('/update-lista/', tokenGenerate, actualizarListas);
router.put('/img-lista/:id_lista', [tokenGenerate], subirImageLista);

export default router;
