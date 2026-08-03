import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { send } from '@emailjs/browser';
import { Link } from "react-router-dom";

const OrderSummary = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const products = useSelector((store) => store.cart.products);
  const { deliveryCharge, grandTotal, totalPrice, selectedItems } = useSelector(
    (store) => store.cart
  );

  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    notes: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        dispatch(clearCart());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, dispatch]);

  // Check if user is logged in (has email)
  if (!user?.email) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg rounded-lg mt-5 p-6 text-center">
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">Login Required</h2>
        <p className="text-gray-700 mb-6">You need to be logged in to place an order.</p>
        <Link
          to="/login"
          className="inline-block bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition-all transform hover:scale-105"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";

    if (!formData.postalCode.trim()) newErrors.postalCode = "Login is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const sendOrderNotification = async (orderData) => {
    try {
      const templateParams = {
        order_id: orderData.orderId || 'N/A',
        customer_name: orderData.customerName || 'No name provided',
        customer_email: orderData.email || 'no-email@example.com',
        customer_phone: orderData.phone || 'Not provided',
        order_items: orderData.products.map(item =>
          `${item.quantity} × ${item.name} - PKR ${(item.price * item.quantity).toFixed(2)}`
        ).join('\n') || 'No items',
        subtotal: `PKR ${orderData.totalAmount?.toFixed(2) || '0.00'}`,
        delivery_charge: `PKR ${deliveryCharge.toFixed(2)}`,
        grand_total: `PKR ${grandTotal.toFixed(2)}`,
        shipping_address: [
          orderData.shippingAddress.address,
          orderData.shippingAddress.city,
          orderData.shippingAddress.state,
          orderData.shippingAddress.zipCode
        ].filter(Boolean).join(', ') || 'Address not provided',
        payment_method: orderData.paymentMethod || 'Not specified',
        customer_notes: orderData.notes || 'No additional notes'
      };

      await send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      return { success: true };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  };

  const handleOrderConfirmation = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        user: user._id, // ✅ Add this line
        products: products.map((product) => ({
          productId: product._id || product.id,
          name: product.name || "Unnamed Product",
          price: Number(product.price) || 0,
          quantity: Number(product.quantity) || 1,
          image: product.image || ""
        })),
        email: user.email,
        phone: formData.phone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.postalCode
        },
        customerName: formData.name,
        totalAmount: totalPrice,
        deliveryCharge: deliveryCharge,
        grandTotal: grandTotal,
        paymentMethod: "Cash on Delivery",
        notes: formData.notes || ""
      };
// console.log("Submitting order:", orderData);


      // const response = await fetch('https://almadin-backend.vercel.app/api/orders/create-order', {
      const response = await fetch('https://scarfaura.vercel.app/api/orders/create-order', {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(orderData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      const emailResult = await sendOrderNotification({
        ...orderData,
        orderId: responseData.orderId || responseData._id
      });

      if (!emailResult.success) {
        console.warn("Email notification failed:", emailResult.error);
      }

      setOrderDetails({
        orderId: responseData.orderId || responseData._id,
        amount: grandTotal.toFixed(2)
      });
      setShowModal(false);
      setShowSuccess(true);
      setFormData({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        notes: ""
      });

      toast.success("Order placed successfully!");

    } catch (error) {
      console.error("Order submission failed:", error);
      let errorMessage = error.message;
      if (error.message.includes("Failed to fetch")) {
        errorMessage = "Network error - please check your connection";
      } else if (error.message.includes("401")) {
        errorMessage = "Session expired - please login again";
      } else if (error.message.includes("500")) {
        errorMessage = "Server error - please try again later";
      }
      toast.error(`Order failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-xl border-2 border-green-200 max-w-md w-full text-center shadow-2xl animate-pulse">
            <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
              <i className="ri-checkbox-circle-fill text-4xl text-green-600"></i>
            </div>
            <h2 className="text-green-800 text-2xl font-bold mb-3">Order Placed Successfully!</h2>
            <div className="bg-white p-4 rounded-lg mb-4 shadow-inner">
              <p className="text-gray-800">Order <strong className="text-indigo-700">#{orderDetails?.orderId}</strong></p>
              <p className="text-gray-800">Total: <strong className="text-green-600">PKR {orderDetails?.amount}</strong></p>
            </div>
            <p className="text-sm text-gray-600">We'll contact you shortly for confirmation.</p>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl mt-5 p-6 border border-gray-200">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-indigo-700 border-b pb-2 border-indigo-100">Order Summary</h1>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-700 font-medium">Items ({selectedItems}):</span>
            <span className="text-gray-900 font-semibold">PKR {totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-700 font-medium">Delivery:</span>
            <span className="text-gray-900 font-semibold">PKR {deliveryCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-3">
            <span className="font-bold text-lg text-gray-800">Total:</span>
            <span className="font-bold text-xl text-indigo-600">PKR {grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => dispatch(clearCart())}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all transform hover:scale-[1.02]"
            disabled={showSuccess}
          >
            <i className="ri-delete-bin-7-line"></i>
            Clear Cart
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all transform hover:scale-[1.02]"
            disabled={showSuccess}
          >
            <i className="ri-truck-line"></i>
            Place Order (Cash on Delivery)
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-indigo-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-indigo-800">Shipping Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {["name", "phone", "address", "city", "state", "postalCode"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                    <span className="text-red-500">*</span>
                  </label>
                  {field === "address" ? (
                    <textarea
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      rows="2"
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 ${errors[field] ? "border-red-500 focus:ring-red-200" : "border-gray-300"
                        }`}
                    />
                  ) : (
                    <input
                      type={field === "phone" ? "tel" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 ${errors[field] ? "border-red-500 focus:ring-red-200" : "border-gray-300"
                        }`}
                    />
                  )}
                  {errors[field] && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <i className="ri-error-warning-line"></i>
                      {errors[field]}
                    </p>
                  )}
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Notes <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  rows="2"
                  placeholder="Any special instructions..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleOrderConfirmation}
                className={`px-4 py-2 text-white rounded-lg font-medium ${isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md"
                  } transition-all`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-loader-4-line animate-spin"></i>
                    Processing...
                  </span>
                ) : (
                  "Confirm Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderSummary;