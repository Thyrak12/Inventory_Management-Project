import API from '../../api.js'

export const fetchProducts = async (setProducts) => {
    try {
        const res = await API.get('/products');
        setProducts(res.data);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

export const addProduct = async (product, setProducts, setShowAddModal, resetForm) => {
    try {
        const res = await API.post('/products', product);
        if (res.status === 201) {
            setProducts(prev => [...prev, res.data]);
            setShowAddModal(false);
            resetForm();
        }
    } catch (error) {
        console.error('Error adding product:', error);
    }
};

export const updateProduct = async (id, updatedProduct, setProducts, fetchProducts, setEditingProduct) => {
    try {
        const res = await API.put('/products', updatedProduct);
        if (res.status === 200) {
            setProducts(prev => prev.map(product => (product.id === id ? res.data : product)));
            await fetchProducts(setProducts);
            setEditingProduct(null);
        }
    } catch (error) {
        console.error('Error updating product:', error);
    }
};

export const deleteProduct = async (id, setProducts, fetchProducts, setShowConfirm) => {
    try {
        const res = await API.delete('/products', { data: { id } });
        if (res.status === 200) {
            await fetchProducts(setProducts);
            setShowConfirm(false);
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
};
