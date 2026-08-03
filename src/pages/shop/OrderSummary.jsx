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
  const { deliveryCharge = 250, grandTotal, totalPrice, selectedItems } = useSelector(
    (store) => store.cart
  );

  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

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
      // ✅ Build order data
      const orderData = {
        products: products.map((product) => ({
          productId: product._id || product.id,
          name: product.name || "Unnamed Product",
          price: Number(product.price) || 0,
          quantity: Number(product.quantity) || 1,
          image: product.image || ""
        })),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        shippingAddress: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.postalCode.trim()
        },
        customerName: formData.name.trim(),
        totalAmount: Number(totalPrice),
        deliveryCharge: Number(deliveryCharge),
        grandTotal: Number(grandTotal),
        paymentMethod: "Cash on Delivery",
        notes: formData.notes?.trim() || ""
      };

      // ✅ Only add user field if logged in
      if (user?._id) {
        orderData.user = user._id;
      }

      console.log("📦 Submitting order:", orderData);

      const response = await fetch('https://scarfaura.vercel.app/api/orders/create-order', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(user?.token && { Authorization: `Bearer ${user.token}` })
        },
        body: JSON.stringify(orderData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMsg = responseData.message || responseData.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMsg);
      }

      // Send email notification
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
        email: "",
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
  const isGuest = !user?.email;

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200 max-w-md w-full text-center shadow-2xl animate-bounce-in">
            <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-green-800 text-2xl font-bold mb-3">Order Placed Successfully! 🎉</h2>
            <div className="bg-white p-4 rounded-xl mb-4 shadow-inner">
              <p className="text-gray-800">Order <strong className="text-indigo-700">#{orderDetails?.orderId}</strong></p>
              <p className="text-gray-800">Total: <strong className="text-green-600">PKR {orderDetails?.amount}</strong></p>
            </div>
            <p className="text-sm text-gray-600">We'll contact you shortly for confirmation.</p>
          </div>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-2xl mt-5 p-6 border border-gray-100">
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b pb-3 border-gray-100">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Order Summary</h1>
          </div>

          {isGuest && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-700">
                  <strong>Guest Checkout:</strong> You're placing an order as a guest.
                  Please provide your email and shipping details below.
                </p>
              </div>
            </div>
          )}

          {/* ✅ Order Items */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {products.map((product) => (
              <div key={product._id || product.id} className="flex justify-between items-center py-2 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  PKR {(product.price * product.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* ✅ Price Breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Subtotal ({selectedItems} items):</span>
              <span className="text-gray-800 font-medium">PKR {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-t border-gray-200">
              <span className="text-gray-600">Delivery Charges:</span>
              <span className="text-gray-800 font-medium">PKR {deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-indigo-200 mt-1">
              <span className="font-bold text-lg text-gray-800">Grand Total:</span>
              <span className="font-bold text-xl text-indigo-600">PKR {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => dispatch(clearCart())}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium py-3 px-4 rounded-xl shadow-md transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={showSuccess}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Cart
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-xl shadow-md transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={showSuccess}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Place Order (Cash on Delivery)
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-800">Shipping Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${errors.name ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {user?.email && (
                  <p className="text-xs text-gray-500 mt-1">Using your account email: {user.email}</p>
                )}
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="03XX-XXXXXXX"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="House #, Street, Area"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${errors.address ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${errors.city ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${errors.state ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                    <option value="Azad Kashmir">Azad Kashmir</option>
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="46000"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${errors.postalCode ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Notes <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                  rows="2"
                  placeholder="Any special delivery instructions..."
                />
              </div>
            </div>

            {/* ✅ Price Summary in Modal */}
            <div className="mt-6 bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-800">PKR {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-gray-200">
                <span className="text-gray-600">Delivery:</span>
                <span className="text-gray-800">PKR {deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-indigo-200 mt-1">
                <span className="font-bold text-gray-800">Total:</span>
                <span className="font-bold text-xl text-indigo-600">PKR {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleOrderConfirmation}
                className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition-all ${isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md"
                  }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
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