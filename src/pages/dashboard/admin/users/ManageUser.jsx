import React, { useState } from 'react';
import { useDeleteUserMutation, useGetUserQuery } from '../../../../redux/features/auth/authApi';
import { Link, useNavigate } from "react-router-dom";
import UpdateUserModal from './UpdateUserModal';

const ManageUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  
  const { data: users = [], error, isLoading, refetch } = useGetUserQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      setDeleteError(null);
      setDeleteSuccess(null);
      
      const response = await deleteUser(id).unwrap();
      setDeleteSuccess('User deleted successfully');
      await refetch();
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setDeleteSuccess(null), 3000);

    } catch (error) {
      console.error("Failed to delete user", error);
      setDeleteError(error.data?.message || 'Failed to delete user');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
        <p>Failed to load users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Messages */}
      {deleteSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
            {deleteSuccess}
          </div>
        </div>
      )}
      {deleteError && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
            {deleteError}
          </div>
        </div>
      )}

      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">All Users</h2>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link 
                    to="/dashboard"
                    className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-indigo-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit Role
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this user?')) {
                                handleDelete(user._id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Update User Modal */}
      {isModalOpen && (
        <UpdateUserModal 
          user={selectedUser} 
          onClose={handleCloseModal} 
          onRoleUpdate={refetch} 
        />
      )}
    </div>
  );
};

export default ManageUser;