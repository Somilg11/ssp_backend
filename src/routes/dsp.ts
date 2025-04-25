import express from 'express';
import { getDSPs, createDSP } from '../controllers/dspController';

const router = express.Router();
router.get('/', getDSPs);

router.post('/', createDSP);

export default router;
