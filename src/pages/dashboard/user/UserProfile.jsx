import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEditProfileMutation } from '../../../redux/features/auth/authApi';
import { setUser } from '../../../redux/features/auth/authSlice';
import avatarImg from "../../../assets/avatar.png";
import { FiEdit, FiX, FiSave } from 'react-icons/fi';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [editProfile, { isLoading }] = useEditProfileMutation();

  const [formData, setFormData] = useState({
    username: '',
    profileImage: '',
    bio: '',
    profession: '',
    userId: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: '', // 'success' or 'error'
    message: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        profileImage: user.profileImage || '',
        bio: user.bio || '',
        profession: user.profession || '',
        userId: user._id || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profileImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await editProfile(formData).unwrap();
      dispatch(setUser(response.user));
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setNotification({
        show: true,
        type: 'success',
        message: 'Profile updated successfully!'
      });

      setTimeout(() => {
        setIsModalOpen(false);
        setNotification({ show: false, type: '', message: '' });
      }, 1500);

    } catch (err) {
      console.error('Failed to update profile:', err);
      setNotification({
        show: true,
        type: 'error',
        message: err.data?.message || 'Failed to update profile. Please try again.'
      });
    }
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center mb-6">
          <div className="relative mb-4 md:mb-0">
            <img
              src={formData.profileImage || avatarImg}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 border-primary"
            />
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-primary hover:text-indigo-700"
                aria-label="Edit profile"
              >
                <FiEdit size={20} />
              </button>
            </div>
          </div>

          <div className="md:ml-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">
              {formData.username || 'Username not set'}
            </h2>
            {formData.profession && (
              <p className="text-lg text-gray-600 mt-1">
                {formData.profession}
              </p>
            )}
            {formData.bio && (
              <p className="text-gray-700 mt-2 max-w-lg">
                {formData.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
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
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={formData.profileImage || avatarImg}
                      alt="Profile preview"
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-sm text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
                    Profession
                  </label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;