import csv from 'csv-parser';
import { Readable } from 'stream';

import * as db from '../config/dbConfig.js';

const TABLE = 'platforms';

const getPlatforms = async (req, res) => {
    try {
        const platforms = await db.getAll(TABLE);
        res.json(platforms);
    } catch (error) {
        res.status(500).json({ message: 'Error getting platforms', error: error.message });
    }
};

const loadPlatforms = async (req, res) => {
    try {
        const platforms = [];
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
                    if (trimmedHeader === 'ID') return 'id';
                    if (trimmedHeader === 'Plataforma Utilizada') return 'name';
                    return trimmedHeader;
                }
            }))
            .on('data', (data) => {              
                if (Object.keys(data).length > 0) {
                    platforms.push(data);
                }
            })
            .on('end', async () => {
                try {
                    if (platforms.length > 0) {
                        await db.loadData({ 'platforms': platforms });
                        res.status(200).json({ message: 'Platforms loaded successfully from local file' });
                    } else {
                        res.status(400).json({ message: 'No data to load' });
                    }
                } catch (dbError) {
                    console.log('here', dbError.message);
                    res.status(500).json({ message: 'Error loading platforms to DB', error: dbError });
                }
            });
    } catch (error) {
        res.status(500).json({ message: 'Error loading platforms', error: error.message });
    }
}

const createPlatform = async (req, res) => {
    try {
        const newPlatform = await db.create(TABLE, req.body);
        res.status(201).json(newPlatform);
    } catch (error) {
        res.status(500).json({ message: 'Error creating platform', error: error.message });
    }
};

const updatePlatform = async (req, res) => {
    try {
        const updatedPlatform = await db.update(TABLE, req.params.id, req.body);
        if (!updatedPlatform) return res.status(404).json({ message: 'Platform not found' });
        res.json(updatedPlatform);
    } catch (error) {
        res.status(500).json({ message: 'Error updating platform', error: error.message });
    }
};

const deletePlatform = async (req, res) => {
    try {
        const deletedPlatform = await db.remove(TABLE, req.params.id);
        if (!deletedPlatform) return res.status(404).json({ message: 'Platform not found' });
        res.json({ message: 'Platform deleted successfully', platform: deletedPlatform });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting platform', error: error.message });
    }
};

export { getPlatforms, loadPlatforms, createPlatform, updatePlatform, deletePlatform };
