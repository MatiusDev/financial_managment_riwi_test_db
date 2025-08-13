import express from 'express';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

import { getPlatforms, loadPlatforms, createPlatform, updatePlatform, deletePlatform } from '../services/platformService.js';

const router = express.Router();

router.get('/', getPlatforms);
router.post('/', createPlatform);
router.post('/upload', upload.single('file'), loadPlatforms);
router.put('/:id', updatePlatform);
router.delete('/:id', deletePlatform);

export default router;
