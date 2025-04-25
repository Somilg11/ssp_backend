import express from 'express';
import { handleAdRequest } from '../controllers/adRequestController';

const router = express.Router();
router.post('/', handleAdRequest);

export default router;
