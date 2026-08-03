import React from 'react';
import { 
  useGetAllOrdersQuery, 
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation  // ✅ Add this import
} from '../../../../redux/features/orders/orderApi';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi';

const ManageOrders = () => {
  const { data: orders = [], isLoading, isError, refetch } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation(); // ✅ Initialize delete mutation

  const DELIVERY_CHARGE = 200; // Fixed delivery charge

  const orderStatuses = ['pending', 'processing', 'shipped', 'Delivered', 'cancelled'];

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success('Order status updated successfully');
      refetch();
    } catch (err) {
      toast.error('Failed to update order status');
      console.error('Update error:', err);
    }
  };

  // ✅ Add delete handler
  const handleDeleteOrder = async (orderId) => {
    // Show confirmation dialog
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteOrder(orderId).unwrap();
      toast.success('Order deleted successfully');
      refetch(); // Refresh the orders list
    } catch (err) {
      toast.error('Failed to delete order');
      console.error('Delete error:', err);
    }
  };

  const calculateTotalFromProducts = (products) => {
    return products.reduce((total, product) => {
      return total + (product.price * product.quantity);
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
    
    // Add delivery charge
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiRefreshCw className="animate-spin text-2xl text-primary" />
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-sm text-red-700">Failed to load orders. 
          <button onClick={refetch} className="ml-2 font-medium text-red-600 hover:text-red-500">
            Retry
          </button>
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
        <p className="mt-1 text-sm text-gray-500">There are currently no orders to display.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Manage Orders</h1>
          <p className="mt-2 text-sm text-gray-700">View and manage all customer orders</p>
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
                <tr key={order._id}>
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
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {getOrderTotal(order)}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button 
                      className="text-primary hover:text-indigo-900 mr-4"
                      onClick={() => {
                        // Edit functionality - you can add edit modal here
                        toast.info('Edit functionality coming soon');
                      }}
                    >
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteOrder(order._id)} // ✅ Add onClick handler
                    >
                      <FiTrash2 className="h-5 w-5" />
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