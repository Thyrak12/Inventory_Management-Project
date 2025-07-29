import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api";
import ProductHeader from '../component/product_src/page_header';
import ProductSearchBar from '../component/product_src/product_searchbar';
import ProductTable from '../component/product_src/product_table';
import AddProductModal from '../component/modal/addProductModal';
import UpdateProductModal from '../component/modal/updateProductModal';
import ConfirmModal from '../component/modal/confirmModal';
import '../style/product.css';

export default function Products() {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [meta, setMeta] = useState({ 
        page: 1, 
        totalPages: 1, 
        totalItems: 0,
        limit: 10
    });
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
        name: '',
        description: '',
        category: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all products once when component mounts
    const fetchAllProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        try {
            const res = await API.get('/products?limit=1000', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllProducts(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError("Failed to load products. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    // Apply search and pagination whenever searchParams or allProducts change
    useEffect(() => {
        if (allProducts.length === 0) return;

        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const searchTerm = (searchParams.get("search") || '').toLowerCase();

        // Filter products based on search term
        let filtered = allProducts;
        if (searchTerm) {
            filtered = allProducts.filter(product => 
                (product.name?.toLowerCase().includes(searchTerm)) ||
                (product.productID?.toLowerCase().includes(searchTerm)) ||
                (product.description?.toLowerCase().includes(searchTerm))
            );
        }

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const paginated = filtered.slice(startIndex, startIndex + limit);

        setFilteredProducts(paginated);
        setMeta({
            page,
            totalPages: Math.ceil(filtered.length / limit),
            totalItems: filtered.length,
            limit
        });
    }, [allProducts, searchParams]);

    const handleSearchSubmit = useCallback((searchTerm) => {
        setSearchParams(prev => {
            prev.set('search', searchTerm);
            prev.set('page', '1');
            return prev;
        });
    }, [setSearchParams]);

    const handleResetSearch = useCallback(() => {
        setSearchParams(prev => {
            prev.delete('search');
            prev.set('page', '1');
            return prev;
        });
    }, [setSearchParams]);

    const handlePageChange = useCallback((newPage) => {
        setSearchParams(prev => {
            prev.set('page', newPage.toString());
            return prev;
        });
        window.scrollTo(0, 0);
    }, [setSearchParams]);

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        try {
            const { name, category } = newProduct;
            if (!name || !category) {
                throw new Error('Name and Category are required fields.');
            }

            await API.post('/products', newProduct, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Refresh the complete product list
            await fetchAllProducts();
            setShowAddModal(false);
            setNewProduct({ name: '', description: '', category: '' });
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
                headers: { Authorization: `Bearer ${token}` },
            });

            // Refresh the complete product list
            await fetchAllProducts();
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
                headers: { Authorization: `Bearer ${token}` },
            });

            // Refresh the complete product list
            await fetchAllProducts();
            setShowConfirm(false);
        } catch (err) {
            console.error('Failed to delete product:', err);
            setError(err.message || 'Failed to delete product');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && allProducts.length === 0) {
        return (
            <div className="product-loading">
                <div className="product-loading-spinner"></div>
            </div>
        );
    }

    if (error && allProducts.length === 0) {
        return (
            <div className="product-error-message">
                {error}
                <button 
                    onClick={() => window.location.reload()} 
                    className="product-error-retry"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="product-management-system">
            <ProductHeader onAddClick={() => setShowAddModal(true)} />
            
            <ProductSearchBar
                searchTerm={searchParams.get("search") || ""}
                onSubmit={handleSearchSubmit}
                onReset={handleResetSearch}
                isLoading={isLoading}
            />

            {error && (
                <div className="product-error-message">
                    {error}
                </div>
            )}

            {filteredProducts.length > 0 ? (
                <>
                    <ProductTable
                        products={filteredProducts}
                        onEdit={(product) => {
                            setEditingProduct(product);
                            setNewProduct({
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

                    <div className="product-pagination">
                        <div className="product-pagination-info">
                            Showing {(meta.page - 1) * meta.limit + 1} to{' '}
                            {Math.min(meta.page * meta.limit, meta.totalItems)} of{' '}
                            {meta.totalItems} items
                        </div>
                        <div className="product-pagination-controls">
                            <button
                                disabled={meta.page <= 1 || isLoading}
                                onClick={() => handlePageChange(meta.page - 1)}
                                className="product-pagination-button"
                            >
                                Previous
                            </button>
                            <button
                                disabled={meta.page >= meta.totalPages || isLoading}
                                onClick={() => handlePageChange(meta.page + 1)}
                                className="product-pagination-button"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="product-empty-state">
                    {allProducts.length === 0 ? 'Loading products...' : 'No products found matching your criteria'}
                </div>
            )}

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