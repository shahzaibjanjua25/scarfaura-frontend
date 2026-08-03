import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../../../redux/features/orders/orderApi';
import TimelineStep from './TimelineStep';

const OrderDetails = () => {
    const { orderId } = useParams();
    const { data: order, error, isLoading } = useGetOrderByIdQuery(orderId);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error?.message || 'Failed to load order'}</div>;
    
    // ✅ FIX: Check if order exists
    if (!order) return <div>Order not found</div>;

    // ✅ FIX: Ensure order has required properties
    const orderStatus = order.status || 'pending';
    const orderIdDisplay = order.orderId || order._id?.slice(-6) || 'N/A';

    const isCompleted = (status) => {
        const statuses = ['pending', 'processing', 'shipped', 'Delivered'];
        return statuses.indexOf(status) < statuses.indexOf(orderStatus);
    };

    const isCurrent = (status) => orderStatus === status;

    const steps = [
        {
            status: 'pending',
            label: 'Pending',
            description: 'Your order has been created and is awaiting processing.',
            icon: { iconName: 'edit-2-line', bgColor: 'red-500', textColor: 'gray-800' },
        },
        {
            status: 'processing',
            label: 'Processing',
            description: 'Your order is currently being processed.',
            icon: { iconName: 'loader-line', bgColor: 'yellow-500', textColor: 'yellow-800' },
        },
        {
            status: 'shipped',
            label: 'Shipped',
            description: 'Your order has been shipped.',
            icon: { iconName: 'truck-line', bgColor: 'blue-800', textColor: 'blue-100' },
        },
        {
            status: 'Delivered',
            label: 'Delivered',
            description: 'Your order has been successfully completed.',
            icon: { iconName: 'check-line', bgColor: 'green-800', textColor: 'white' },
        },
    ];

    // ✅ FIX: Ensure products is an array
    const products = Array.isArray(order.products) ? order.products : [];

    return (
        <div className="section__container rounded p-6">
            <h2 className="text-2xl font-semibold mb-4">
                Payment {orderStatus}
            </h2>
            <p className="mb-4">Order ID: {orderIdDisplay}</p>
            <p className="mb-8">Status: {orderStatus}</p>

            {/* Order Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                {products.length === 0 ? (
                    <p>No products in this order</p>
                ) : (
                    products.map((product, index) => (
                        <div key={product._id || index} className="flex justify-between py-2 border-b">
                            <span>{product.name || 'Product'}</span>
                            <span>PKR {(product.price || 0).toFixed(2)} x {product.quantity || 1}</span>
                        </div>
                    ))
                )}
                <div className="flex justify-between py-2 font-bold">
                    <span>Total</span>
                    <span>PKR {order.totalAmount || order.totalPrice || '0.00'}</span>
                </div>
            </div>

            {/* Timeline */}
            <ol className="items-center sm:flex relative">
                {steps.map((step, index) => (
                    <TimelineStep
                        key={step.status}
                        step={step}
                        order={order}
                        isCompleted={isCompleted(step.status)}
                        isCurrent={isCurrent(step.status)}
                        isLastStep={index === steps.length - 1}
                        icon={step.icon}
                        description={step.description}
                    />
                ))}
            </ol>
        </div>
    );
};

export default OrderDetails;