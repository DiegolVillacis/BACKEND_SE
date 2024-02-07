import { Router } from 'express';
import { tokenGenerate } from '../security/tokenBlock';
import { deleteMetodoGeneral } from '../controllers/procesosControllers';

const router: Router = Router();

router.delete('/registro', tokenGenerate, deleteMetodoGeneral);



export default router;