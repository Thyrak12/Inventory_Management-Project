import API from '../../api.js';

export const fetchSalesRecords = async () => {
    try {
        const response = await API.get('/sales-records');

        if (!response || !response.data) {
            throw new Error('No data received from server');
        }

        if (!Array.isArray(response.data)) {
            console.warn('Expected array but received:', response.data);
            return [];
        }

        return response.data;
    } catch (error) {
        console.error('API Error - fetchSalesRecords:', error.message);
        throw error;
    }
};

export const addSaleRecord = async (saleData) => {
    try {
        const response = await API.post('/sales-records', saleData);

        if (response.status !== 201 || !response.data) {
            throw new Error('Failed to create sale record');
        }

        return response.data;
    } catch (error) {
        console.error('API Error - addSaleRecord:', error.message);
        throw error;
    }
};

export const updateSaleRecord = async (id, saleData) => {
    try {
        const response = await API.put(`/sales-records/${id}`, saleData);

        if (response.status !== 200 || !response.data) {
            throw new Error('Failed to update sale record');
        }

        return response.data;
    } catch (error) {
        console.error('API Error - updateSaleRecord:', error.message);
        throw error;
    }
};

export const deleteSaleRecord = async (id) => {
    try {
        const response = await API.delete(`/sales-records/${id}`);

        if (response.status !== 200) {
            throw new Error('Failed to delete sale record');
        }

        return true;
    } catch (error) {
        console.error('API Error - deleteSaleRecord:', error.message);
        throw error;
    }
};
