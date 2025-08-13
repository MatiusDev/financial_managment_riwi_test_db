import { getData, sendData, updateData, deleteData, sendFile } from "./api.js";

const ENDPOINT = 'clients';

const getClients = async () => {
    try {
        const data = await getData(ENDPOINT);
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching clients:', error);
    }
};

const createClient = async (client) => {
    try {
        const data = await sendData(ENDPOINT, client);
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error posting clients:', error);
    }
}

const updateClient = async (id, client) => {
    try {
        const data = await updateData(ENDPOINT, id, client);
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error updating clients:', error);
    }
}

const deleteClient = async (id) => {
    try {
        await deleteData(ENDPOINT, id);
    } catch (error) {
        console.log('Error deleting a client', error);
    }
}

const uploadClients = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const data = await sendFile(`${ENDPOINT}/upload`, formData);
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error uploading clients:', error);
        throw error;
    }
}

export { getClients, createClient, updateClient, deleteClient, uploadClients };
