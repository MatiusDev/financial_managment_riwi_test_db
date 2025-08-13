import express from 'express';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

import { getTransactions, loadTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/transactionService.js';

const router = express.Router();

router.get('/', getTransactions);
router.post('/', createTransaction);
router.post('/upload', upload.single('file'), loadTransactions);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
