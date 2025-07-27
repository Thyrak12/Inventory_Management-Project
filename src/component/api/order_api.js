import API from '../../api.js';

export const fetchSales = async () => {
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
        console.error('API Error - fetchSales:', error.message);
        throw error;
    }
};

export const addSale = async (saleData) => {
    try {
        const response = await API.post('/sales', saleData);

        if (response.status !== 201 || !response.data) {
            throw new Error('Failed to create sale');
        }

        return response.data;
    } catch (error) {
        console.error('API Error - addSale:', error.message);
        throw error;
    }
};

export const updateSale = async (id, saleData) => {
    try {
        const response = await API.put(`/sales/${id}`, saleData);

        if (response.status !== 200 || !response.data) {
            throw new Error('Failed to update sale');
        }

        return response.data;
    } catch (error) {
        console.error('API Error - updateSale:', error.message);
        throw error;
    }
};

export const deleteSale = async (id) => {
    try {
        const response = await API.delete(`/sales/${id}`);

        if (response.status !== 200) {
            throw new Error('Failed to delete sale');
        }

        return true;
    } catch (error) {
        console.error('API Error - deleteSale:', error.message);
        throw error;
    }
};
