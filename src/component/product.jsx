import React, { useEffect, useState } from 'react';
import ProductHeader from './product_src/page_header';
import ProductSearchBar from './product_src/product_searchbar';
import ProductTable from './product_src/product_table';
import AddProductModal from '../modal/addProductModal';
import UpdateProductModal from '../modal/updateProductModal';
import ConfirmModal from '../modal/confirmModal';
import '../style/product.css'; // Ensure product styles exist
import {
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
} from './product_src/product_hook';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productID, setProductID] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newProduct, setNewProduct] = useState({ name: '', sku: '', category: '', price: '', quantity: '' });
    const [newUpdateProduct, setNewUpdateProduct] = useState({ name: '', sku: '', category: '', price: '', quantity: '' });

    useEffect(() => {
        fetchProducts(setProducts);
    }, []);

    const handleCreateProduct = (e) => {
        e.preventDefault();
        const { name, sku, category, price, quantity } = newProduct;
        if (!name || !sku || isNaN(price) || isNaN(quantity)) {
            alert('Fill out all fields correctly.');
            return;
        }
        const status = quantity > 10 ? 'In Stock' : quantity > 0 ? 'Low Stock' : 'Out of Stock';
        addProduct({ name, sku, category, price: parseFloat(price), quantity: parseInt(quantity), status }, setProducts, setShowAddModal, resetForm);
    };

    const resetForm = () => {
        setNewProduct({ name: '', sku: '', category: '', price: '', quantity: '' });
    };

    const handleConfirmDelete = () => {
        if (deleteId) deleteProduct(deleteId, setProducts, fetchProducts, setShowConfirm);
        setDeleteId(null);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductID(product._id);
        setNewUpdateProduct({ ...product });
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="products-page">
            <ProductHeader onAddClick={() => { resetForm(); setShowAddModal(true); }} />
            <ProductSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <ProductTable products={filteredProducts} onEdit={handleEditProduct} onDelete={(id) => { setDeleteId(id); setShowConfirm(true); }} />

            {showAddModal && (
                <AddProductModal
                    onClose={() => { setShowAddModal(false); resetForm(); }}
                    newProduct={newProduct}
                    setNewProduct={setNewProduct}
                    onSubmit={handleCreateProduct}
                />
            )}

            {editingProduct && (
                <UpdateProductModal
                    onClose={() => setEditingProduct(null)}
                    newProduct={newUpdateProduct}
                    setNewProduct={setNewUpdateProduct}
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateProduct(productID, { ...newUpdateProduct, status: 'Updated' }, setProducts, fetchProducts, setEditingProduct);
                    }}
                />
            )}

            {showConfirm && (
                <ConfirmModal
                    message="Are you sure you want to delete this product?"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </div>
    );
};

export default ProductsPage;
