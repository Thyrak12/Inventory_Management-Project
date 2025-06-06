import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaBoxOpen } from 'react-icons/fa';
import axios from 'axios';
import AddProductModal from './addProductModal.jsx';
import UpdateProductModal from './updateProductModal.jsx';
import './style/product.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
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

  // Update product
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
        setEditingProduct(null); // Close update modal
        resetForm();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

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

  // Handle update product form submit
  const handleUpdateProduct = (e) => {
    e.preventDefault();

    if (!editingProduct || !editingProduct.id) {
      console.error('No valid editingProduct or ID');
      return;
    }

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

    const updatedProduct = {
      id: editingProduct.id,
      name: name.trim(),
      sku: sku.trim(),
      category,
      price: parsedPrice,
      quantity: parsedQuantity,
      status,
    };

    updateProduct(editingProduct.id, updatedProduct);
  };

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
            resetForm();
          }}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          onSubmit={handleUpdateProduct}
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
            {products.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  No products found matching your criteria
                </td>
              </tr>
            )}
            {products.map((product) => (
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
                <td>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => {
                      setEditingProduct(product);
                      setNewProduct({
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
