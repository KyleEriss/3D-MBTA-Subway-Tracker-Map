import { Router } from 'express';

import { GetAllSubwayCarCoordinates } from '../controllers/GetAllSubwayCarCoordinates';

const router = Router();

router.get('/', GetAllSubwayCarCoordinates);

export default router;