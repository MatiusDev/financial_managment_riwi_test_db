import express from 'express';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

import { getInvoices, loadInvoices, createInvoice, updateInvoice, deleteInvoice } from '../services/invoiceService.js';

const router = express.Router();

router.get('/', getInvoices);
router.post('/', createInvoice);
router.post('/upload', upload.single('file'), loadInvoices);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

export default router;
