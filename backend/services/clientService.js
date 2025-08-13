import csv from 'csv-parser';
import { Readable } from 'stream';

import * as db from '../config/dbConfig.js';

const TABLE = 'clients';

const getClients = async (req, res) => {
    try {
        const clients = await db.getAll(TABLE);
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error getting clients', error: error.message });
    }
};

const loadClients = async (req, res) => {
    try {
        const clients = [];
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
                    if (trimmedHeader === 'ID_cliente') return 'id';
                    if (trimmedHeader === 'Nombre del Cliente') return 'name';
                    if (trimmedHeader === 'Correo Electrónico') return 'email';
                    if (trimmedHeader === 'Teléfono') return 'phone';
                    if (trimmedHeader === 'Dirección') return 'address';
                    return trimmedHeader;
                }
            }))
            .on('data', (data) => {              
                if (Object.keys(data).length > 0) {
                    clients.push(data);
                }
            })
            .on('end', async () => {
                try {
                    if (clients.length > 0) {
                        await db.loadData({ 'clients': clients });
                        res.status(200).json({ message: 'Clients loaded successfully from local file' });
                    } else {
                        res.status(400).json({ message: 'No data to load' });
                    }
                } catch (dbError) {
                    console.log('here', dbError.message);
                    res.status(500).json({ message: 'Error loading clients to DB', error: dbError });
                }
            });
    } catch (error) {
        res.status(500).json({ message: 'Error loading clients', error: error.message });
    }
}

const createClient = async (req, res) => {
    try {
        const newClient = await db.create(TABLE, req.body);
        res.status(201).json(newClient);
    } catch (error) {
        res.status(500).json({ message: 'Error creating client', error: error.message });
    }
};

const updateClient = async (req, res) => {
    try {
        const updatedClient = await db.update(TABLE, req.params.id, req.body);
        if (!updatedClient) return res.status(404).json({ message: 'Client not found' });
        res.json(updatedClient);
    } catch (error) {
        res.status(500).json({ message: 'Error updating client', error: error.message });
    }
};

const deleteClient = async (req, res) => {
    try {
        const deletedClient = await db.remove(TABLE, req.params.id);
        if (!deletedClient) return res.status(404).json({ message: 'Client not found' });
        res.json({ message: 'Client deleted successfully', client: deletedClient });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting client', error: error.message });
    }
};

export { getClients, loadClients, createClient, updateClient, deleteClient };
