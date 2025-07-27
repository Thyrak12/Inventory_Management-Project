import React, { useState, useEffect } from 'react';
import { fetchVariants, updateStock } from '../component/api/product_var_api.js';
import OrderHeader from '../component/order_component/header';
import OrderFilter from '../component/order_component/filter';
import OrderCart from '../component/order_component/cart';
import OrdersTable from '../component/order_component/table';
import AddProductModal from '../component/order_component/add_modal';
import '../style/order.css';

const OrdersPage = () => {
    const [recentOrders, setRecentOrders] = useState([]);
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
                setProductVariants(variants);
            } catch (error) {
                console.error('Failed to load product variants:', error);
                setError('Failed to load products. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        loadVariants();
    }, []);

    // Group variants by product name (unique names only)
    const productNames = [...new Set(productVariants.map(v => v.name))];

    // Create select options with just product names
    const productOptions = productNames.map(name => ({
        value: name,
        label: name
    }));

    // When product is selected, find all its variants
    useEffect(() => {
        if (newOrder.product) {
            const variants = productVariants.filter(v => v.name === newOrder.product);
            setSelectedProductVariants(variants);

            // Reset color and size when product changes
            setNewOrder(prev => ({
                ...prev,
                color: '',
                size: ''
            }));
        } else {
            setSelectedProductVariants([]);
        }
    }, [newOrder.product, productVariants]);

    // Get available colors for selected product
    const availableColors = [...new Set(selectedProductVariants.map(v => v.color))];

    // Get available sizes for selected product and color
    const availableSizes = [...new Set(
        selectedProductVariants
            .filter(v => !newOrder.color || v.color === newOrder.color)
            .map(v => v.size)
    )];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrder({ ...newOrder, [name]: value });
    };

    const addToCart = () => {
        if (!newOrder.product || !newOrder.color || !newOrder.size || newOrder.qty <= 0) {
            alert('Please fill all required fields');
            return;
        }

        const selectedVariant = productVariants.find(v =>
            v.name === newOrder.product &&
            v.color === newOrder.color &&
            v.size === newOrder.size
        );

        if (!selectedVariant) {
            alert('Selected product variant not found');
            return;
        }

        // Check stock availability
        if ((selectedVariant.stock || 0) < newOrder.qty) {
            alert(`Only ${selectedVariant.stock} available in stock`);
            return;
        }

        const cartItem = {
            id: Date.now(),
            product: selectedVariant.name,
            color: selectedVariant.color,
            size: selectedVariant.size,
            qty: newOrder.qty,
            price: selectedVariant.price || 0,
            total: ((selectedVariant.price || 0) * newOrder.qty).toFixed(2)
        };

        setCart([...cart, cartItem]);
        setShowAddModal(false);
        setNewOrder({
            product: '',
            color: '',
            size: '',
            qty: 1
        });
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const checkout = async () => {
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Create a copy of product variants to modify
            let updatedVariants = [...productVariants];

            // 1. Update stock for each item in cart
            for (const item of cart) {
                // Find the variant index
                const variantIndex = updatedVariants.findIndex(v =>
                    v.name === item.product &&
                    v.color === item.color &&
                    v.size === item.size
                );

                if (variantIndex === -1) {
                    throw new Error(`Variant not found for ${item.product} (${item.color}, ${item.size})`);
                }

                // Calculate new stock
                const currentStock = updatedVariants[variantIndex].stock || 0;
                const newStock = currentStock - item.qty;

                if (newStock < 0) {
                    throw new Error(`Insufficient stock for ${item.product} (${item.color}, ${item.size})`);
                }

                // Update via API
                await updateStock(updatedVariants[variantIndex].id, newStock);

                // Update local copy
                updatedVariants[variantIndex] = {
                    ...updatedVariants[variantIndex],
                    stock: newStock
                };
            }

            // 2. Create order records
            const lastOrderID = recentOrders.length > 0 ?
                Math.max(...recentOrders.map(o => o.orderID)) : 1000;

            const newOrders = cart.map((item, index) => ({
                orderID: lastOrderID + index + 1,
                date: new Date().toLocaleDateString(),
                ...item,
                status: 'Completed'
            }));

            // 3. Update all state at once
            setProductVariants(updatedVariants);
            setRecentOrders([...newOrders, ...recentOrders]);
            setCart([]);

            alert('Checkout completed successfully!');
        } catch (error) {
            console.error('Checkout failed:', error);
            setError(error.message || 'Checkout failed. Please try again.');

            // Refresh variants to get current stock levels
            try {
                const freshVariants = await fetchVariants();
                setProductVariants(freshVariants);
            } catch (refreshError) {
                console.error('Failed to refresh variants:', refreshError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const filteredOrders = recentOrders.filter(order =>
        order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderID.toString().includes(searchTerm) ||
        order.date.includes(searchTerm)
    );

    const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.total), 0).toFixed(2);

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
            />
            <OrdersTable orders={filteredOrders} />
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