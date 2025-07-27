import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchVariants } from "../component/api/product_var_api.js";
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
                        Number(variant.price)
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
    }, [searchParams]);

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

            setSearchParams(prev => {
                prev.set('refresh', Date.now());
                return prev;
            });
        } catch (err) {
            console.error('Failed to update variant:', err);
            setError('Failed to update variant');
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
            prev.set('page', newPage);
            return prev;
        });
        window.scrollTo(0, 0);
    };

    const handleStockProduct = async (productId, quantity) => {
        setIsLoading(true);
        setError(null);

        try {
            // Here you would call your API to update the stock
            // For now, we'll simulate it with local state
            const updatedVariants = variants.map(v =>
                v.id === productId
                    ? { ...v, stock: (v.stock || 0) + quantity }
                    : v
            );

            setVariants(updatedVariants);
            setShowStockModal(false);
            setSearchParams(prev => {
                prev.set('refresh', Date.now());
                return prev;
            });
        } catch (err) {
            console.error('Failed to update stock:', err);
            setError('Failed to update stock');
        } finally {
            setIsLoading(false);
        }
    };

    // Get unique products for the modal (combine name, color, size)
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
                stock: variant.stock || 0
            });
        }
        return acc;
    }, []);

    if (isLoading && variants.length === 0) {
        return (
            <div className="stock-loading">
                <div className="stock-loading-spinner"></div>
            </div>
        );
    }

    if (error && variants.length === 0) {
        return (
            <div className="stock-error-message">
                {error}
                <button
                    onClick={() => window.location.reload()}
                    className="stock-error-retry"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="stock-management-system">
            <StockHeader onStockProductClick={() => setShowStockModal(true)} />

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
            />

            {error && (
                <div className="stock-error-message">
                    {error}
                </div>
            )}

            {filteredVariants.length > 0 ? (
                <>
                    <StockTable
                        variants={filteredVariants}
                        onEdit={setEditingVariant}
                    />

                    <div className="stock-pagination">
                        <div className="stock-pagination-info">
                            Showing {(meta.page - 1) * meta.limit + 1} to {Math.min(meta.page * meta.limit, meta.totalItems)} of {meta.totalItems} items
                        </div>

                        <div className="stock-pagination-controls">
                            <button
                                disabled={meta.page <= 1 || isLoading}
                                onClick={() => handlePageChange(meta.page - 1)}
                                className="stock-pagination-button"
                            >
                                Previous
                            </button>

                            <button
                                disabled={meta.page >= meta.totalPages || isLoading}
                                onClick={() => handlePageChange(meta.page + 1)}
                                className="stock-pagination-button"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="stock-empty-state">
                    No variants found matching your filters
                </div>
            )}

            <EditVariantModal
                show={!!editingVariant}
                onClose={() => setEditingVariant(null)}
                variant={editingVariant}
                onSubmit={handleUpdateVariant}
                isLoading={isLoading}
            />
            <StockProductModal
                show={showStockModal}
                onClose={() => setShowStockModal(false)}
                products={uniqueProducts}
                onStockProduct={handleStockProduct}
                isLoading={isLoading}
            />
        </div>
    );
}