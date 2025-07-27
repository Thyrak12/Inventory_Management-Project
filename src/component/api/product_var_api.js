import API from '../../api.js';

export const fetchVariants = async () => {
    try {
        const response = await API.get('/product-variants');

        // Check if response exists and has data
        if (!response || !response.data) {
            throw new Error('No data received from server');
        }

        // Ensure the data is an array
        if (!Array.isArray(response.data)) {
            console.warn('Expected array but received:', response.data);
            return []; // Return empty array as fallback
        }

        return response.data;
    } catch (error) {
        console.error('API Error - fetchProducts:', error.message);
        throw error; // Re-throw to let component handle it
    }
};

export const addProduct = async (productData) => {
    try {
        const response = await API.post('/product-variants', productData);

        if (response.status !== 201 || !response.data) {
            throw new Error('Failed to create product');
        }

        return response.data;
    } catch (error) {
        console.error('API Error - addProduct:', error.message);
        throw error;
    }
};

export const updateStock = async (variantId, newStock) => {
    try {
        const token = localStorage.getItem("token");
        
        // First get the current variant to preserve other fields
        const currentVariant = await API.get(`/product-variants/${variantId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!currentVariant.data) {
            throw new Error('Variant not found');
        }
        
        // Update the variant with new stock while preserving other fields
        const response = await API.put(`/product-variants/${variantId}`,
            { 
                product_id: currentVariant.data.product_id,
                name: currentVariant.data.name,
                price: currentVariant.data.price,
                stock: newStock
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status !== 200) {
            throw new Error('Failed to update stock');
        }

        return response.data;
    } catch (error) {
        console.error('Error updating stock:', error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await API.delete(`/product-variants/${id}`);

        if (response.status !== 200) {
            throw new Error('Failed to delete product');
        }

        return true;
    } catch (error) {
        console.error('API Error - deleteProduct:', error.message);
        throw error;
    }
};