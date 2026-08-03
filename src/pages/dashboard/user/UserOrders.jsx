import React from 'react';
import { useSelector } from 'react-redux';
import { useGetOrdersByEmailQuery } from '../../../redux/features/orders/orderApi';
import { FiRefreshCw } from 'react-icons/fi';

const UserOrders = () => {
  const user = useSelector((state) => state.auth.user);

  const {
    data: ordersData,
    isLoading,
    isError,
    refetch,
  } = useGetOrdersByEmailQuery(user?.email, {
    skip: !user?.email,
  });

  const orders = ordersData ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiRefreshCw className="animate-spin text-2xl text-primary" />
        <span className="ml-2">Loading your orders...</span>
      </div>
    );
  }
  if (!orders.length) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
        <p className="mt-1 text-sm text-gray-500">
          You haven't placed any orders yet.
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-sm text-red-700">
          Failed to load your orders.
          <button
            onClick={refetch}
            className="ml-2 text-sm font-medium text-red-600 hover:text-red-500"
          >
            Retry
          </button>
        </p>
      </div>
    );
  }


  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Your Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            Review your order history
          </p>
        </div>
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    #{order.orderId || order._id.slice(-6)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-700">
                    {order.status || 'pending'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    PKR {(
                      order.products.reduce((sum, p) => sum + p.price * p.quantity, 0) + 200
                    ).toFixed(2)}
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

export default UserOrders;
