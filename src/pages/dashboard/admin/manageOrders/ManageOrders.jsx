import React, { useState } from 'react';
import { 
  useGetAllOrdersQuery, 
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation
} from '../../../../redux/features/orders/orderApi';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

const ManageOrders = () => {
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  
  const { data: orders = [], isLoading, isError, error, refetch } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const DELIVERY_CHARGE = 200;
  const orderStatuses = ['pending', 'processing', 'shipped', 'Delivered', 'cancelled'];

  // Handle status update with better error handling
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const result = await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success(result?.message || 'Order status updated successfully');
      refetch();
    } catch (err) {
      console.error('Update error:', err);
      // Extract error message from response
      const errorMessage = err?.data?.message || err?.message || 'Failed to update order status';
      toast.error(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle delete with better error handling
  const handleDeleteOrder = async (orderId) => {
    // Show confirmation dialog
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    setDeletingId(orderId);
    try {
      const result = await deleteOrder(orderId).unwrap();
      toast.success(result?.message || 'Order deleted successfully');
      refetch();
    } catch (err) {
      console.error('Delete error:', err);
      // Extract error message from response
      const errorMessage = err?.data?.message || err?.message || 'Failed to delete order';
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const calculateTotalFromProducts = (products) => {
    if (!products || !Array.isArray(products)) return 0;
    return products.reduce((total, product) => {
      return total + ((product.price || 0) * (product.quantity || 0));
    }, 0);
  };

  const getOrderTotal = (order) => {
    let subtotal = 0;
    
    // Calculate subtotal from direct amount or products
    if (order.totalAmount || order.totalPrice || order.amount) {
      subtotal = order.totalAmount || order.totalPrice || order.amount;
    } else if (order.products && order.products.length > 0) {
      subtotal = calculateTotalFromProducts(order.products);
    }
    
    const total = subtotal + DELIVERY_CHARGE;
    return formatAsPKR(total);
  };

  const formatAsPKR = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Loading state with better UI
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <FiRefreshCw className="animate-spin text-4xl text-primary" />
        <span className="mt-4 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  // Error state with detailed error message
  if (isError) {
    const errorMessage = error?.data?.message || error?.message || 'Failed to load orders';
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-md">
        <div className="flex items-start">
          <FiAlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Failed to Load Orders</h3>
            <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
            <button 
              onClick={() => refetch()} 
              className="mt-3 inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-md transition-colors"
            >
              <FiRefreshCw className="mr-2 h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
        <p className="mt-2 text-sm text-gray-500">There are currently no orders to display.</p>
        <button 
          onClick={() => refetch()} 
          className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          <FiRefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Manage Orders</h1>
          <p className="mt-2 text-sm text-gray-700">View and manage all customer orders</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            <FiRefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => (
                <tr key={order._id} className={deletingId === order._id ? 'opacity-50' : ''}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    #{order.orderId || order._id.slice(-6)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {order.email || 'N/A'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                        updatingId === order._id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                    {updatingId === order._id && (
                      <span className="text-xs text-gray-400 ml-2">Updating...</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {getOrderTotal(order)}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button 
                      className="text-primary hover:text-indigo-900 mr-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        toast.info('Edit functionality coming soon');
                      }}
                      disabled={deletingId === order._id}
                    >
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDeleteOrder(order._id)}
                      disabled={deletingId === order._id}
                    >
                      {deletingId === order._id ? (
                        <FiRefreshCw className="h-5 w-5 animate-spin" />
                      ) : (
                        <FiTrash2 className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;