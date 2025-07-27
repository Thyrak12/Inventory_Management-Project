import API from '../../api.js';

export const fetchProducts = async (params = {}) => {
    try {
        const response = await API.get('/products', { params });
        
        if (!response || !response.data) {
            throw new Error('No data received from server');
        }

        return {
            data: response.data.data || [],
            meta: response.data.meta || { page: 1, totalPages: 1 }
        };
    } catch (error) {
        console.error('API Error - fetchProducts:', error.message);
        throw error;
    }
};

export const addProduct = async (productData) => {
    try {
        const response = await API.post('/products', productData);
        
        if (response.status !== 201 || !response.data) {
            throw new Error('Failed to create product');
        }

        return response.data;
    } catch (error) {
        console.error('API Error - addProduct:', error.message);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await API.put(`/products/${id}`, productData);
        
        if (response.status !== 200 || !response.data) {
            throw new Error('Failed to update product');
        }

        return response.data;
    } catch (error) {
        console.error('API Error - updateProduct:', error.message);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await API.delete(`/products/${id}`);
        
        if (response.status !== 200) {
            throw new Error('Failed to delete product');
        }

        return true;
    } catch (error) {
        console.error('API Error - deleteProduct:', error.message);
        throw error;
    }
};

export const fetchProductCategories = async () => {
    try {
        const response = await API.get('/products/categories');
        
        if (!response || !response.data) {
            throw new Error('No categories received');
        }

        return response.data;
    } catch (error) {
        console.error('API Error - fetchProductCategories:', error.message);
        throw error;
    }
};