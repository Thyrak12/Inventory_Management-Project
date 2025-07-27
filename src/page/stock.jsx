import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchVariants, updateStock } from "../component/api/product_var_api.js";
import StockHeader from '../component/stock_component/header';
import StockFilters from '../component/stock_component/filter';
import StockTable from '../component/stock_component/table';
import EditVariantModal from '../component/stock_component/edit_modal';
import StockProductModal from '../component/stock_component/add_modal';
import '../style/stock.css';

export default function Stock() {
    const [variants, setVariants] = useState([]);
    const [filteredVariants, setFilteredVariants] = useState([]);
    const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
    const [searchParams, setSearchParams] = useSearchParams({
        page: 1,
        limit: 10,
        search: '',
        size: '',
        color: '',
        minPrice: '0',
        maxPrice: '1000'
    });
    const [editingVariant, setEditingVariant] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);
    const [showStockModal, setShowStockModal] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const loadVariants = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const allVariants = await fetchVariants();

                const processedData = allVariants.map(variant => ({
                    ...variant,
                    price: typeof variant.price === 'string' ?
                        parseFloat(variant.price) :
                        Number(variant.price),
                    stock: variant.stock ? Number(variant.stock) : 0
                }));

                const sizes = [...new Set(allVariants.map(v => v.size))].filter(Boolean);
                const colors = [...new Set(allVariants.map(v => v.color))].filter(Boolean);
                setAvailableSizes(sizes);
                setAvailableColors(colors);
                setVariants(processedData);
                applyFilters(processedData);

            } catch (err) {
                console.error("Failed to fetch variants:", err);
                setError("Failed to load variants. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        loadVariants();
    }, []);

    useEffect(() => {
        if (variants.length > 0) {
            applyFilters(variants);
        }
    }, [searchParams, variants]);

    const applyFilters = (data) => {
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const search = searchParams.get("search") || '';
        const size = searchParams.get("size") || '';
        const color = searchParams.get("color") || '';
        const minPrice = parseFloat(searchParams.get("minPrice")) || 0;
        const maxPrice = parseFloat(searchParams.get("maxPrice")) || 1000;

        let filtered = [...data];

        if (search) {
            filtered = filtered.filter(v =>
                v.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (size) {
            filtered = filtered.filter(v => v.size === size);
        }

        if (color) {
            filtered = filtered.filter(v => v.color === color);
        }

        filtered = filtered.filter(v => {
            const price = Number(v.price) || 0;
            return price >= minPrice && price <= maxPrice;
        });

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const paginatedVariants = filtered.slice(startIndex, startIndex + limit);

        setFilteredVariants(paginatedVariants);
        setMeta({ page, totalPages, totalItems, limit });
    };

    const handleUpdateVariant = async (updatedVariant) => {
        setIsLoading(true);
        setError(null);

        try {
            const updatedVariants = variants.map(v =>
                v.id === updatedVariant.id ? updatedVariant : v
            );

            setVariants(updatedVariants);
            setEditingVariant(null);
            setNotification('Variant updated successfully!');
        } catch (err) {
            console.error('Failed to update variant:', err);
            setError('Failed to update variant');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStockUpdate = async (productId, quantity, action) => {
        setIsLoading(true);
        setError(null);
        setNotification(null);

        try {
            // Find the current variant
            const currentVariant = variants.find(v => v.id === productId);
            if (!currentVariant) throw new Error('Product variant not found');

            // Calculate new stock based on action
            let newStock;
            if (action === 'add') {
                newStock = currentVariant.stock + quantity;
            } else if (action === 'set') {
                newStock = quantity;
            } else {
                throw new Error('Invalid action');
            }

            // Validate new stock
            if (newStock < 0) throw new Error('Stock cannot be negative');

            // Update via API
            await updateStock(productId, newStock);

            // Update local state
            setVariants(prev => prev.map(v =>
                v.id === productId ? { ...v, stock: newStock } : v
            ));

            setShowStockModal(false);
            setNotification(`Stock ${action === 'add' ? 'added' : 'set'} successfully! New stock: ${newStock}`);
        } catch (err) {
            console.error('Failed to update stock:', err);
            setError(err.message || 'Failed to update stock');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (filters) => {
        setSearchParams(prev => {
            prev.set('search', filters.search);
            prev.set('size', filters.size);
            prev.set('color', filters.color);
            prev.set('minPrice', filters.minPrice.toString());
            prev.set('maxPrice', filters.maxPrice.toString());
            prev.set('page', '1');
            return prev;
        });
    };

    const handleResetFilters = () => {
        setSearchParams({
            page: '1',
            limit: '10',
            search: '',
            size: '',
            color: '',
            minPrice: '0',
            maxPrice: '1000'
        });
    };

    const handlePageChange = (newPage) => {
        setSearchParams(prev => {
            prev.set('page', newPage.toString());
            return prev;
        });
        window.scrollTo(0, 0);
    };

    // Get unique products for the modal
    const uniqueProducts = variants.reduce((acc, variant) => {
        const existing = acc.find(p =>
            p.name === variant.name &&
            p.color === variant.color &&
            p.size === variant.size
        );
        if (!existing) {
            acc.push({
                id: variant.id,
                name: variant.name,
                color: variant.color,
                size: variant.size,
                stock: variant.stock
            });
        }
        return acc;
    }, []);

    if (isLoading && variants.length === 0) {
        return <div className="stock-loading">Loading...</div>;
    }

    if (error && variants.length === 0) {
        return (
            <div className="stock-error-message">
                {error}
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="stock-management-system">
            {notification && (
                <div className="notification">
                    {notification}
                    <button onClick={() => setNotification(null)}>×</button>
                </div>
            )}

            <StockHeader
                onStockProductClick={() => setShowStockModal(true)}
                isLoading={isLoading}
            />

            <StockFilters
                searchTerm={searchParams.get("search") || ""}
                sizeFilter={searchParams.get("size") || ""}
                colorFilter={searchParams.get("color") || ""}
                priceRange={[
                    parseFloat(searchParams.get("minPrice") || 0),
                    parseFloat(searchParams.get("maxPrice") || 1000)
                ]}
                availableSizes={availableSizes}
                availableColors={availableColors}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                disabled={isLoading}
            />

            {error && (
                <div className="stock-error-message">
                    {error}
                    <button onClick={() => setError(null)}>Dismiss</button>
                </div>
            )}

            {filteredVariants.length > 0 ? (
                <>
                    <StockTable
                        variants={filteredVariants}
                        onEdit={setEditingVariant}
                        isLoading={isLoading}
                    />

                    <div className="stock-pagination">
                        <div className="stock-pagination-info">
                            Showing {(meta.page - 1) * meta.limit + 1} to{' '}
                            {Math.min(meta.page * meta.limit, meta.totalItems)} of{' '}
                            {meta.totalItems} items
                        </div>
                        <div className="stock-pagination-controls">
                            <button
                                disabled={meta.page <= 1 || isLoading}
                                onClick={() => handlePageChange(meta.page - 1)}
                            >
                                Previous
                            </button>
                            <button
                                disabled={meta.page >= meta.totalPages || isLoading}
                                onClick={() => handlePageChange(meta.page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="stock-empty-state">
                    {isLoading ? 'Loading...' : 'No variants found matching your filters'}
                </div>
            )}

            <EditVariantModal
                show={!!editingVariant}
                onClose={() => setEditingVariant(null)}
                variant={editingVariant}
                onSubmit={handleUpdateVariant}
                isLoading={isLoading}
                availableColors={availableColors}
                availableSizes={availableSizes}
            />

            <StockProductModal
                show={showStockModal}
                onClose={() => setShowStockModal(false)}
                products={uniqueProducts}
                onStockUpdate={handleStockUpdate}
                isLoading={isLoading}
            />
        </div>
    );
}