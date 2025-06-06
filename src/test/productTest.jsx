import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaBoxOpen, FaTrash, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import AddProductModal from '../modal/addProductModal.jsx';
import UpdateProductModal from '../modal/updateProductModal.jsx';
import ConfirmModal from '../modal/confirmModal.jsx';
import '../style/product.css';
import Header from '../component/product_src/page_header.jsx'

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productID, setProductID] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [newProduct, setNewProduct] = useState({
        name: '',
        sku: '',
        category: '',
        price: '',
        quantity: '',
    });
    const [newUpdateProduct, setNewUpdateProduct] = useState({
        name: '',
        sku: '',
        category: '',
        price: '',
        quantity: '',
    });

    // Fetch products on mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:3000/products');
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Add product
    const addProduct = async (product) => {
        try {
            const res = await axios.post('http://localhost:3000/products', product);
            if (res.status === 201) {
                setProducts((prev) => [...prev, res.data]);
                setShowAddModal(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const deleteProduct = async (id) => {
        if (!id) {
            console.error('Missing ID in deleteProduct');
            return;
        }
        try {
            const res = await axios.delete(`http://localhost:3000/products/${id}`);
            if (res.status === 200) {
                setProducts((prev) => prev.filter((product) => product.id !== id));
                console.log('Product deleted successfully');
                await fetchProducts(); // Refresh product list
                setShowConfirm(false); // Close confirmation modal
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }

    const updateProduct = async (id, updatedProduct) => {
        if (!id) {
            console.error('Missing ID in updateProduct');
            return;
        }
        try {
            const res = await axios.put(`http://localhost:3000/products/${id}`, updatedProduct);
            if (res.status === 200) {
                setProducts((prev) =>
                    prev.map((product) => (product.id === id ? res.data : product))
                );
                await fetchProducts(); // Refresh product list
                setEditingProduct(null); // Close update modal
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    }

    // Reset form data
    const resetForm = () => {
        setNewProduct({
            name: '',
            sku: '',
            category: '',
            price: '',
            quantity: '',
        });
    };

    // Stock status helper
    const getStockStatus = (stock) => {
        if (stock > 10) return 'In Stock';
        if (stock > 0) return 'Low Stock';
        return 'Out of Stock';
    };

    // Handle new product form submit
    const handleCreateProduct = (e) => {
        e.preventDefault();
        const { name, sku, category, price, quantity } = newProduct;

        if (!name.trim() || !sku.trim()) {
            alert('Product name and SKU are required.');
            return;
        }

        const parsedPrice = parseFloat(price);
        const parsedQuantity = parseInt(quantity);

        if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
            alert('Price and quantity must be valid numbers.');
            return;
        }

        const status = parsedQuantity > 10 ? 'In Stock' : parsedQuantity > 0 ? 'Low Stock' : 'Out of Stock';

        addProduct({
            name: name.trim(),
            sku: sku.trim(),
            category,
            price: parsedPrice,
            quantity: parsedQuantity,
            status,
        });
    };


    const handleUpdateProduct = (e) => {
        e.preventDefault();
        const { name, sku, category, price, quantity } = newUpdateProduct;
        if (!name.trim() || !sku.trim()) {
            alert('Product name and SKU are required.');
            return;
        }
        const parsedPrice = parseFloat(price);
        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
            alert('Price and quantity must be valid numbers.');
            return;
        }
        const status = parsedQuantity > 10 ? 'In Stock' : parsedQuantity > 0 ? 'Low Stock' : 'Out of Stock';
        updateProduct(productID, {
            name: name.trim(),
            sku: sku.trim(),
            category,
            price: parsedPrice,
            quantity: parsedQuantity,
            status,
        });

        setEditingProduct(null); // Close update modal
    }

    const handleConfirmDelete = (e) => {
        e.preventDefault();
        if (deleteId) {
            deleteProduct(deleteId);
            setDeleteId(null); // Reset delete ID after deletion
        }
        setShowConfirm(false); // Close confirmation modal
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="products-page">

            <div className="page-header">
                <h1>
                    <FaBoxOpen className="header-icon" /> Product Inventory
                </h1>
                <button className="add-product-btn" onClick={() => { resetForm(); setShowAddModal(true); }}>
                    <FaPlus /> Add Product
                </button>
            </div>


            <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>


            {/* Add Product Modal */}
            {showAddModal && (
                <AddProductModal
                    onClose={() => {
                        setShowAddModal(false);
                        resetForm();
                    }}
                    newProduct={newProduct}
                    setNewProduct={setNewProduct}
                    onSubmit={handleCreateProduct}
                />
            )}

            {/* Update Product Modal */}
            {editingProduct && (
                <UpdateProductModal
                    onClose={() => {
                        setEditingProduct(null);
                        setNewUpdateProduct({
                            name: '',
                            sku: '',
                            category: '',
                            price: '',
                            quantity: '',
                        });
                    }}
                    newProduct={newUpdateProduct}
                    setNewProduct={setNewUpdateProduct}
                    onSubmit={handleUpdateProduct}
                />
            )}

            {showConfirm && (
                <ConfirmModal
                    message="Are you sure you want to delete this product?"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>
                                    No products found matching your criteria
                                </td>
                            </tr>
                        )}
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.sku}</td>
                                <td>{product.category}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>{product.quantity}</td>
                                <td>
                                    <span
                                        className={`status-badge ${getStockStatus(product.quantity)
                                            .replace(/\s+/g, '-')
                                            .toLowerCase()}`}
                                    >
                                        {getStockStatus(product.quantity)}
                                    </span>
                                </td>
                                <td className='actions'>
                                    <button
                                        className="action-btn edit-btn"
                                        onClick={() => {
                                            setEditingProduct(product);
                                            setProductID(product._id);
                                            setNewUpdateProduct({
                                                name: product.name,
                                                sku: product.sku,
                                                category: product.category,
                                                price: product.price,
                                                quantity: product.quantity,
                                            });
                                        }}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        style={{ backgroundColor: 'transparent', color: 'red' }}
                                        onClick={() => {
                                            setDeleteId(product._id);
                                            setShowConfirm(true);
                                        }}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductsPage;
