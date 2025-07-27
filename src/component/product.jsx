import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "./product_src/product_hook.js";
import ProductHeader from './product_src/page_header';
import ProductSearchBar from './product_src/product_searchbar';
import ProductTable from './product_src/product_table';
import AddProductModal from '../modal/addProductModal';
import UpdateProductModal from '../modal/updateProductModal';
import ConfirmModal from '../modal/confirmModal';
import '../style/product.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limit: 10,
    search: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
    productID: '',
    name: '', 
    description: '', 
    category: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const page = searchParams.get("page") || 1;
      const limit = searchParams.get("limit") || 10;
      const search = searchParams.get("search") || '';

      try {
        const res = await API.get(`/products?page=${page}&limit=${limit}&search=${search}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(res.data.data || []);
        setMeta(res.data.meta || { page: 1, totalPages: 1 });
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    
    try {
      const { productID, name, category } = newProduct;
      if (!productID || !name || !category) {
        throw new Error('Product ID, Name, and Category are required fields.');
      }

      await API.post('/products', newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh the product list
      setSearchParams(prev => {
        prev.set('refresh', Date.now()); // Force refresh
        return prev;
      });
      setShowAddModal(false);
      setNewProduct({ productID: '', name: '', description: '', category: '' });
    } catch (err) {
      console.error('Failed to create product:', err);
      setError(err.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    
    try {
      await API.put(`/products/${editingProduct.id}`, newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh the product list
      setSearchParams(prev => {
        prev.set('refresh', Date.now()); // Force refresh
        return prev;
      });
      setEditingProduct(null);
    } catch (err) {
      console.error('Failed to update product:', err);
      setError(err.message || 'Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    
    try {
      await API.delete(`/products/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh the product list
      setSearchParams(prev => {
        prev.set('refresh', Date.now()); // Force refresh
        return prev;
      });
      setShowConfirm(false);
    } catch (err) {
      console.error('Failed to delete product:', err);
      setError(err.message || 'Failed to delete product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchParams(prev => {
      prev.set('search', searchTerm);
      prev.set('page', 1); // Reset to first page when searching
      return prev;
    });
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ProductHeader onAddClick={() => setShowAddModal(true)} />
      <ProductSearchBar 
        searchTerm={searchParams.get("search") || ""}
        onSearchChange={handleSearch}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <ProductTable 
        products={products} 
        onEdit={(product) => {
          setEditingProduct(product);
          setNewProduct({
            productID: product.productID,
            name: product.name,
            description: product.description,
            category: product.category
          });
        }}
        onDelete={(id) => {
          setDeleteId(id);
          setShowConfirm(true);
        }}
      />

      <div className="mt-6 flex justify-between items-center">
        <button
          disabled={meta.page <= 1 || isLoading}
          onClick={() => setSearchParams(prev => {
            prev.set('page', Number(meta.page) - 1);
            return prev;
          })}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <span className="text-sm text-gray-600">
          Page {meta.page} of {meta.totalPages} | {meta.totalItems || products.length} items
        </span>
        
        <button
          disabled={meta.page >= meta.totalPages || isLoading}
          onClick={() => setSearchParams(prev => {
            prev.set('page', Number(meta.page) + 1);
            return prev;
          })}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Modals */}
      <AddProductModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        product={newProduct}
        onChange={setNewProduct}
        onSubmit={handleCreateProduct}
        isLoading={isLoading}
      />

      <UpdateProductModal
        show={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={newProduct}
        onChange={setNewProduct}
        onSubmit={handleUpdateProduct}
        isLoading={isLoading}
      />

    </div>
  );
}