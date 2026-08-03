import React, { useState } from 'react';
import { useUpdateUserRoleMutation } from '../../../../redux/features/auth/authApi';

const UpdateUserModal = ({ user, onClose, onRoleUpdate }) => {
    const [role, setRole] = useState(user.role);
    const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();
    const [notification, setNotification] = useState({
        show: false,
        type: '', // 'success' or 'error'
        message: ''
    });

    const handleUpdateRole = async () => {
        try {
            await updateUserRole({ userId: user._id, role }).unwrap();
            
            setNotification({
                show: true,
                type: 'success',
                message: 'User role updated successfully!'
            });

            // Auto-close after 1.5 seconds
            setTimeout(() => {
                onRoleUpdate();
                onClose();
            }, 1500);

        } catch (error) {
            console.error("Failed to update user role", error);
            setNotification({
                show: true,
                type: 'error',
                message: error.data?.message || 'Failed to update user role'
            });
        }
    };

    const closeNotification = () => {
        setNotification(prev => ({ ...prev, show: false }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Update User Role</h2>
                    
                    {/* Notification */}
                    {notification.show && (
                        <div className={`mb-4 p-3 rounded-md ${
                            notification.type === 'success' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                        }`}>
                            <div className="flex justify-between items-center">
                                <span>{notification.message}</span>
                                <button 
                                    onClick={closeNotification}
                                    className="text-lg font-bold"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="text"
                                value={user.email}
                                readOnly
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="moderator">Moderator</option> {/* Added example of additional role */}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdateRole}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-70"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateUserModal;