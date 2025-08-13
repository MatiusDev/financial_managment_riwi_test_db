import csv from 'csv-parser';
import { Readable } from 'stream';

import * as db from '../config/dbConfig.js';

const TABLE = 'transactions';

const getTransactions = async (req, res) => {
    try {
        const transactions = await db.getAll(TABLE);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error getting transactions', error: error.message });
    }
};

const loadTransactions = async (req, res) => {
    try {
        const transactions = [];
        const { file } = req;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        
        if (file.mimetype !== 'text/csv' && file.mimetype !== 'application/vnd.ms-excel') {
            return res.status(400).json({ message: 'Invalid file type. Please upload a CSV file.' });
        }

        const ReadableFileStream = Readable.from(file.buffer); 
        ReadableFileStream
            .pipe(csv({
                bom: true,
                mapHeaders: ({ header }) => {
                    const trimmedHeader = header.trim();
                    if (trimmedHeader === 'ID Transaccion') return 'id';
                    if (trimmedHeader === 'ID factura') return 'invoice_id';
                    if (trimmedHeader === 'ID plataforma') return 'platform_id';
                    if (trimmedHeader === 'Tipo de Transacción') return 'type';
                    if (trimmedHeader === 'Fecha y Hora de la Transacción') return 'transaction_date';
                    if (trimmedHeader === 'Monto de la Transacción') return 'amount';
                    if (trimmedHeader === 'Estado de la Transacción') return 'status';
                    return trimmedHeader;
                }
            }))
            .on('data', (data) => {              
                if (Object.keys(data).length > 0) {
                    transactions.push(data);
                }
            })
            .on('end', async () => {
                try {
                    if (transactions.length > 0) {
                        await db.loadData({ 'transactions': transactions });
                        res.status(200).json({ message: 'Transactions loaded successfully from local file' });
                    } else {
                        res.status(400).json({ message: 'No data to load' });
                    }
                } catch (dbError) {
                    console.log('here', dbError.message);
                    res.status(500).json({ message: 'Error loading transactions to DB', error: dbError });
                }
            });
    } catch (error) {
        res.status(500).json({ message: 'Error loading transactions', error: error.message });
    }
}

const createTransaction = async (req, res) => {
    try {
        const newTransaction = await db.create(TABLE, req.body);
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Error creating transaction', error: error.message });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const updatedTransaction = await db.update(TABLE, req.params.id, req.body);
        if (!updatedTransaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Error updating transaction', error: error.message });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const deletedTransaction = await db.remove(TABLE, req.params.id);
        if (!deletedTransaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json({ message: 'Transaction deleted successfully', transaction: deletedTransaction });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting transaction', error: error.message });
    }
};

export { getTransactions, loadTransactions, createTransaction, updateTransaction, deleteTransaction };
