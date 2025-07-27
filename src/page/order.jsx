import React, { useState, useEffect } from 'react';
import { fetchVariants, updateStock } from '../component/api/product_var_api.js';
import { fetchSalesRecords } from '../component/api/record_api.js';
import OrderHeader from '../component/order_component/header';
import OrderFilter from '../component/order_component/filter';
import OrderCart from '../component/order_component/cart';
import OrdersTable from '../component/order_component/table';
import AddProductModal from '../component/order_component/add_modal';
import '../style/order.css';

const OrdersPage = () => {
    const [recentOrders, setRecentOrders] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 0
    });
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);
    const [recordsError, setRecordsError] = useState(null);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newOrder, setNewOrder] = useState({
        product: '',
        color: '',
        size: '',
        qty: 1
    });
    const [productVariants, setProductVariants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedProductVariants, setSelectedProductVariants] = useState([]);

    // Fetch product variants from API
    useEffect(() => {
        const loadVariants = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const variants = await fetchVariants();
                setProductVariants(Array.isArray(variants) ? variants : []);
            } catch (error) {
                console.error('Failed to load product variants:', error);
                setError('Failed to load products. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        loadVariants();
    }, []);

    // Fetch sales records with pagination
        const loadSalesRecords = async (page = 1) => {
            setIsLoadingRecords(true);
            setRecordsError(null);

            try {
                const response = await fetchSalesRecords(page, pagination.limit);

                // Destructure the expected response format
                const {
                    data: records = [],
                    totalItems = 0,
                    totalPages = 1,
                    currentPage = 1
                } = response;

                console.log('API Response:', { records, totalItems, totalPages, currentPage });

                // Transform records if needed (assuming your API already returns them in the correct format)
                const transformedRecords = Array.isArray(records) ? records : [];
                console.log(transformedRecords);

                setRecentOrders(transformedRecords);
                setPagination(prev => ({
                    ...prev,
                    page: currentPage,  // Use the currentPage from API response
                    total: totalItems,   // Total number of items
                    totalPages          // Total number of pages
                }));

            } catch (error) {
                console.error('Failed to load sales records:', error);
                setRecordsError(error.message || 'Failed to load orders');
            } finally {
                setIsLoadingRecords(false);
            }
    };

    // Initial load and when page changes
    useEffect(() => {
        loadSalesRecords(pagination.page);
    }, [pagination.page]);

    const handleNextPage = () => {
        if (pagination.page < pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const handlePrevPage = () => {
        if (pagination.page > 1) {
            setPagination(prev => ({ ...prev, page: prev.page - 1 }));
        }
    };

    // Group variants by product name (unique names only)
    const productNames = [...new Set(
        (productVariants || [])
            .map(v => v?.name)
            .filter(name => typeof name === 'string')
    )];

    // Create select options with just product names
    const productOptions = productNames.map(name => ({
        value: name,
        label: name
    }));

    // When product is selected, find all its variants
    useEffect(() => {
        if (newOrder.product && Array.isArray(productVariants)) {
            const variants = productVariants.filter(v => v?.name === newOrder.product);
            setSelectedProductVariants(Array.isArray(variants) ? variants : []);
        } else {
            setSelectedProductVariants([]);
        }
    }, [newOrder.product, productVariants]);

    // Get available colors for selected product
    const availableColors = [...new Set(
        (selectedProductVariants || [])
            .map(v => v?.color)
            .filter(color => typeof color === 'string')
    )];

    // Get available sizes for selected product and color
    const availableSizes = [...new Set(
        (selectedProductVariants || [])
            .filter(v => !newOrder.color || v?.color === newOrder.color)
            .map(v => v?.size)
            .filter(size => typeof size === 'string')
    )];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrder(prev => ({ ...prev, [name]: value }));
    };

    const addToCart = () => {
        if (!newOrder.product || !newOrder.color || !newOrder.size || newOrder.qty <= 0) {
            alert('Please fill all required fields');
            return;
        }

        const selectedVariant = (productVariants || []).find(v =>
            v?.name === newOrder.product &&
            v?.color === newOrder.color &&
            v?.size === newOrder.size
        );

        if (!selectedVariant) {
            alert('Selected product variant not found');
            return;
        }

        // Check stock availability
        const currentStock = Number(selectedVariant?.stock) || 0;
        if (currentStock < newOrder.qty) {
            alert(`Only ${currentStock} available in stock`);
            return;
        }

        const price = Number(selectedVariant?.price) || 0;
        const cartItem = {
            id: Date.now(),
            product: selectedVariant.name,
            color: selectedVariant.color,
            size: selectedVariant.size,
            qty: newOrder.qty,
            price: price,
            total: (price * newOrder.qty).toFixed(2)
        };

        setCart(prev => [...prev, cartItem]);
        setShowAddModal(false);
        setNewOrder({
            product: '',
            color: '',
            size: '',
            qty: 1
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const checkout = async () => {
        if (!Array.isArray(cart) || cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Create a copy of product variants to modify
            const updatedVariants = [...(productVariants || [])];

            // 1. Update stock for each item in cart
            for (const item of cart) {
                const variantIndex = updatedVariants.findIndex(v =>
                    v?.name === item.product &&
                    v?.color === item.color &&
                    v?.size === item.size
                );

                if (variantIndex === -1) {
                    throw new Error(`Variant not found for ${item.product} (${item.color}, ${item.size})`);
                }

                const variant = updatedVariants[variantIndex];
                const currentStock = Number(variant?.stock) || 0;
                const newStock = currentStock - item.qty;

                if (newStock < 0) {
                    throw new Error(`Insufficient stock for ${item.product} (${item.color}, ${item.size})`);
                }

                // Update via API
                await updateStock(variant.id, newStock);

                // Update local copy
                updatedVariants[variantIndex] = {
                    ...variant,
                    stock: newStock
                };
            }

            // 2. Create new order records for the cart
            const lastOrderID = recentOrders.length > 0 ?
                Math.max(...recentOrders.map(o => Number(o?.orderID) || 0)) : 1000;

            const newOrders = cart.map((item, index) => ({
                orderID: lastOrderID + index + 1,
                date: new Date().toLocaleDateString(),
                product: item.product,
                color: item.color,
                size: item.size,
                qty: item.qty,
                price: item.price,
                total: item.total,
                status: 'Completed'
            }));

            // 3. Update all state at once
            setProductVariants(updatedVariants);
            setRecentOrders(prev => [...newOrders, ...prev]);
            setCart([]);
            loadSalesRecords(1); // Refresh to first page

            alert('Checkout completed successfully!');
        } catch (error) {
            console.error('Checkout failed:', error);
            setError(error.message || 'Checkout failed. Please try again.');

            // Refresh variants to get current stock levels
            try {
                const freshVariants = await fetchVariants();
                setProductVariants(Array.isArray(freshVariants) ? freshVariants : []);
            } catch (refreshError) {
                console.error('Failed to refresh variants:', refreshError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Filter orders with safe checks
    const filteredOrders = (recentOrders || []).filter(order => {
        const product = String(order?.product || '').toLowerCase();
        const orderID = String(order?.orderID || '').toLowerCase();
        const date = String(order?.date || '').toLowerCase();
        const search = String(searchTerm || '').toLowerCase();

        return product.includes(search) ||
            orderID.includes(search) ||
            date.includes(search);
    });

    // Calculate cart total with safe checks
    const cartTotal = (cart || []).reduce((sum, item) => {
        return sum + (Number(item?.total) || 0);
    }, 0).toFixed(2);

    return (
        <div className="orders-page">
            <OrderHeader onAddClick={() => setShowAddModal(true)} />
            <OrderFilter
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
            />
            <OrderCart
                cart={cart}
                cartTotal={cartTotal}
                onRemoveItem={removeFromCart}
                onCheckout={checkout}
                isLoading={isLoading}
            />

            {isLoadingRecords ? (
                <div className="loading-message">Loading orders...</div>
            ) : recordsError ? (
                <div className="error-message">{recordsError}</div>
            ) : (
                <>
                    <OrdersTable orders={filteredOrders} />
                    <div className="pagination-controls">
                        <button
                            onClick={handlePrevPage}
                            disabled={pagination.page === 1 || isLoadingRecords}
                        >
                            Previous
                        </button>

                        <span>
                            Page {pagination.page} of {pagination.totalPages}
                        </span>

                        <button
                            onClick={handleNextPage}
                            disabled={pagination.page >= pagination.totalPages || isLoadingRecords}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            <AddProductModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                newOrder={newOrder}
                onInputChange={handleInputChange}
                onAddToCart={addToCart}
                productOptions={productOptions}
                availableColors={availableColors}
                availableSizes={availableSizes}
                error={error}
                isLoading={isLoading}
                hasProducts={productOptions.length > 0}
            />
        </div>
    );
};

export default OrdersPage;