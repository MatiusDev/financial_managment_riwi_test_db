import csv from 'csv-parser';
import { Readable } from 'stream';

import * as db from '../config/dbConfig.js';

const TABLE = 'invoices';

const getInvoices = async (req, res) => {
    try {
        const invoices = await db.getAll(TABLE);
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: 'Error getting invoices', error: error.message });
    }
};

const loadInvoices = async (req, res) => {
    try {
        const invoices = [];
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
                    if (trimmedHeader === 'ID factura') return 'id';
                    if (trimmedHeader === 'ID cliente') return 'client_id';
                    if (trimmedHeader === 'Periodo de Facturación') return 'period';
                    if (trimmedHeader === 'Monto Facturado') return 'total_billed';
                    if (trimmedHeader === 'Monto Pagado') return 'total_paid';
                    return trimmedHeader;
                }
            }))
            .on('data', (data) => {              
                if (Object.keys(data).length > 0) {
                    invoices.push(data);
                }
            })
            .on('end', async () => {
                try {
                    if (invoices.length > 0) {
                        await db.loadData({ 'invoices': invoices });
                        res.status(200).json({ message: 'Invoices loaded successfully from local file' });
                    } else {
                        res.status(400).json({ message: 'No data to load' });
                    }
                } catch (dbError) {
                    console.log('here', dbError.message);
                    res.status(500).json({ message: 'Error loading invoices to DB', error: dbError });
                }
            });
    } catch (error) {
        res.status(500).json({ message: 'Error loading invoices', error: error.message });
    }
}

const createInvoice = async (req, res) => {
    try {
        const newInvoice = await db.create(TABLE, req.body);
        res.status(201).json(newInvoice);
    } catch (error) {
        res.status(500).json({ message: 'Error creating invoice', error: error.message });
    }
};

const updateInvoice = async (req, res) => {
    try {
        const updatedInvoice = await db.update(TABLE, req.params.id, req.body);
        if (!updatedInvoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(updatedInvoice);
    } catch (error) {
        res.status(500).json({ message: 'Error updating invoice', error: error.message });
    }
};

const deleteInvoice = async (req, res) => {
    try {
        const deletedInvoice = await db.remove(TABLE, req.params.id);
        if (!deletedInvoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json({ message: 'Invoice deleted successfully', invoice: deletedInvoice });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting invoice', error: error.message });
    }
};

export { getInvoices, loadInvoices, createInvoice, updateInvoice, deleteInvoice };
