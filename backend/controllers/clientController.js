import express from 'express';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

import { getClients, loadClients, createClient, updateClient, deleteClient } from '../services/clientService.js';

const router = express.Router();

router.get('/', getClients);
router.post('/', createClient);
router.post('/upload', upload.single('file'), loadClients);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;
