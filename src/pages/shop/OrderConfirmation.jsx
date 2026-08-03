import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getBaseUrl } from '../../utils/baseURL';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { state } = useLocation();
  const [order, setOrder] = React.useState(state?.order || null);
  const [loading, setLoading] = React.useState(!state?.order);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!state?.order) {
      const fetchOrder = async () => {
        try {
          const response = await fetch(`${getBaseUrl()}/api/orders/order/${orderId}`);
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Failed to fetch order');
          setOrder(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId, state]);

  if (loading) return <div className="container mx-auto p-4">Loading order details...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
        <p className="text-lg mb-6">Thank you for your purchase. Your order has been received.</p>
        
        <div className="bg-gray-50 p-4 rounded mb-6">
          <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <p className="font-medium">Order Number:</p>
            <p>{orderId}</p>
            
            <p className="font-medium">Date:</p>
            <p>{new Date(order?.createdAt || Date.now()).toLocaleDateString()}</p>
            
            <p className="font-medium">Total:</p>
            <p>${state?.grandTotal || order?.amount?.toFixed(2)}</p>
            
            <p className="font-medium">Payment Method:</p>
            <p>{order?.paymentMethod || 'Cash on Delivery'}</p>
            
            <p className="font-medium">Status:</p>
            <p className="capitalize">{order?.status || 'pending'}</p>
          </div>
        </div>

        {order?.products && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Order Items</h3>
            <div className="divide-y">
              {order.products.map((product, index) => (
                <div key={index} className="py-3 flex items-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-gray-600">{product.quantity} × ${product.price.toFixed(2)}</p>
                  </div>
                  <p className="font-medium">
                    ${(product.price * product.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link 
            to="/products" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-center transition"
          >
            Continue Shopping
          </Link>
          <Link 
            to={`/orders/${orderId}`} 
            className="border border-gray-300 hover:bg-gray-100 px-6 py-2 rounded text-center transition"
          >
            View Order Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;