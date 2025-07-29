import API from '../../api.js';

export const fetchSalesRecords = async (page = 1, limit = 10) => {
    try {
        const response = await API.get('/sales-records', {
            params: {
                page,
                limit,
                sort: 'id',
                order: 'desc'
            }
        });

        if (!response?.data) {
            throw new Error('Invalid server response structure');
        }

        const { 
            data = [], 
            totalItems = 0, 
            totalPages = 1, 
            currentPage = 1 
        } = response.data;

        // Transform and validate each record with enhanced handling
        const transformedData = data.map(record => {
            const variant = record.productVariant || {};
            const product = variant.Product || variant.product || {};
            
            return {
                orderID: record.id || 'N/A',
                date: formatDate(record.saleCreatedAt || record.createdAt || record.date),
                product: getProductName(record),
                color: normalizeAttribute(variant.color, 'color'),
                size: normalizeAttribute(variant.size, 'size'),
                qty: Math.max(0, parseInt(record.qty)) || 0,
                price: parseFloat(record.price_each || record.price || 0).toFixed(2),
                total: (parseFloat(record.price_each || record.price || 0) * 
                      (parseInt(record.qty) || 0)).toFixed(2),
                status: record.status || 'Completed'
            };
        });

        return {
            data: transformedData,
            totalItems: Number(totalItems) || 0,
            totalPages: Number(totalPages) || 1,
            currentPage: Number(currentPage) || 1
        };
    } catch (error) {
        console.error('Failed to fetch sales records:', error);
        throw new Error(error.message || 'Failed to load sales records');
    }
};

// Enhanced helper functions
const formatDate = (dateString) => {
    if (!dateString || dateString.toString().toUpperCase() === 'N/A') {
        return new Date().toLocaleDateString();
    }
    try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? new Date().toLocaleDateString() : date.toLocaleDateString();
    } catch {
        return new Date().toLocaleDateString();
    }
};

const getProductName = (record) => {
    // Try multiple possible paths to product name
    const nameSources = [
        record.productName,
        record.product?.name,
        record.productVariant?.Product?.name,
        record.productVariant?.product?.name,
        record.item?.product?.name
    ];
    
    const validName = nameSources.find(name => 
        name && name.toString().toUpperCase() !== 'N/A'
    );
    
    return validName || 'Unknown Product';
};

const normalizeAttribute = (value, attributeName) => {
    if (!value || value.toString().trim() === '' || 
        value.toString().toUpperCase() === 'N/A') {
        return `No ${attributeName}`;
    }
    return value.toString().trim();
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

export const addSaleRecord = async (recordData) => {
    try {
        const response = await API.post('/sales-records', recordData);

        if (response.status !== 201 || !response.data) {
            throw new Error('Failed to create saleRecord');
        }

        return response.data;
    } catch (error) {
        console.error('API Error - addSaleRecord:', error.message);
        throw error;
    }
};
