import { Router } from 'express';

import { GetAllSubwayCars } from '../controllers/GetAllSubwayCars';

const router = Router();

router.get('/', GetAllSubwayCars);

export default router;