import { Router } from 'express';
const router: Router = Router();

import { tokenGenerate } from '../security/tokenBlock';

import { getMenuItems, createEstudiante, getListasEstudiante, login, updateEstudiante, getListasEstudiantenovoto, updateArchivo, getListasEstudiantevota } from '../controllers/userControllers';

router.post('/login', login);

router.get('/navegacion', tokenGenerate, getMenuItems);

router.get('/listae', tokenGenerate, getListasEstudiante);
router.get('/listaenovoto', tokenGenerate, getListasEstudiantenovoto);
router.get('/listaevota', tokenGenerate, getListasEstudiantevota);

router.post('/registrare', tokenGenerate, createEstudiante);
router.put('/updatee', tokenGenerate, updateEstudiante);

router.post('/updatefile', [tokenGenerate], updateArchivo);


export default router;