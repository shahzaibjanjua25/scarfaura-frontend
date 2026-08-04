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
      // ✅ Fix: Send "N/A" for empty postal code
      const zipCodeValue = formData.postalCode.trim() || "N/A";

      const orderData = {
        ...(user?._id && { user: user._id }),
        customerName: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        shippingAddress: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: zipCodeValue // ✅ Send "N/A" if empty
        },
        products: products.map((product) => ({
          productId: product._id || product.id,
          name: product.name || "Unnamed Product",
          price: Number(product.price) || 0,
          quantity: Number(product.quantity) || 1,
          image: product.image || ""
        })),
        paymentMethod: "Cash on Delivery",
        totalAmount: Number(totalPrice),
        deliveryCharge: Number(deliveryCharge),
        grandTotal: Number(grandTotal),
        notes: formData.notes?.trim() || ""
      };

      console.log("📦 Sending order data:", orderData);

      const response = await fetch('https://scarfaura.vercel.app/api/orders/create-order', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(user?.token && { Authorization: `Bearer ${user.token}` })
        },
        body: JSON.stringify(orderData)
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response:", responseText);
        throw new Error("Server returned an invalid response");
      }

      if (!response.ok) {
        const errorMsg = responseData.error || responseData.message || `HTTP error! status: ${response.status}`;
        console.error("Server error response:", responseData);
        throw new Error(errorMsg);
      }

      try {
        const emailResult = await sendOrderNotification({
          ...orderData,
          orderId: responseData.orderId || responseData._id
        });
        if (!emailResult.success) {
          console.warn("Email notification failed:", emailResult.error);
        }
      } catch (emailError) {
        console.warn("Email notification error:", emailError);
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
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSuccess(false)} />
          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-fadeIn">
            <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-gray-800 mb-2">Order Confirmed</h2>
            <p className="text-gray-500 text-sm mb-4">Your order has been placed successfully</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-gray-600 text-sm">Order ID</p>
              <p className="text-gray-800 font-semibold font-mono text-sm">#{orderDetails?.orderId}</p>
              <p className="text-gray-600 text-sm mt-2">Total Amount</p>
              <p className="text-emerald-600 font-bold text-xl">PKR {orderDetails?.amount}</p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Order Summary Card - Full Width */}
          <div className="order-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-900/5 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-medium text-gray-800">Order Summary</h2>
                    <p className="text-xs text-gray-400">{selectedItems} items in your cart</p>
                  </div>
                </div>
              </div>

              {/* Guest Notice */}
              {isGuest && (
                <div className="mx-6 mt-4 px-4 py-3 bg-amber-50/80 border border-amber-200/50 rounded-xl text-sm text-amber-700 flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>You're checking out as a guest. <span className="font-medium">Sign in</span> to track your orders easily.</span>
                </div>
              )}

              {/* Products List */}
              <div className="px-6 py-4 space-y-3 max-h-72 overflow-y-auto">
                {products.map((product) => (
                  <div key={product._id || product.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-xl bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">Qty: {product.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      PKR {(product.price * product.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({selectedItems} items)</span>
                    <span className="text-gray-700 font-medium">PKR {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery Charges</span>
                    <span className="text-gray-700 font-medium">PKR {deliveryCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-800 font-medium">Grand Total</span>
                    <span className="text-emerald-600 font-bold text-lg">PKR {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-5 bg-white border-t border-gray-100 space-y-3">
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full py-3.5 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={showSuccess}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Place Order
                  </span>
                </button>
                <button
                  onClick={() => dispatch(clearCart())}
                  className="w-full py-3 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                  disabled={showSuccess}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Details Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-serif font-medium text-gray-800">Shipping Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:bg-white transition-all outline-none text-sm`}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:bg-white transition-all outline-none text-sm`}
                />
                {user?.email && (
                  <p className="text-xs text-gray-400 mt-1">Using account email: {user.email}</p>
                )}
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="03XX-XXXXXXX"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.phone ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:bg-white transition-all outline-none text-sm`}
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Shipping Address <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="House #, Street, Area"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.address ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:bg-white transition-all outline-none text-sm resize-none`}
                />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.city ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:bg-white transition-all outline-none text-sm`}
                  />
                  {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    State <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.state ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:bg-white transition-all outline-none text-sm appearance-none`}
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
                  {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                </div>
              </div>

              {/* Postal Code - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Postal Code <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="46000 (optional)"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:bg-white transition-all outline-none text-sm"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Delivery Notes <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:bg-white transition-all outline-none text-sm resize-none"
                  rows="2"
                  placeholder="Any special delivery instructions..."
                />
              </div>
            </div>

            {/* Price Summary & Actions */}
            <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400">Total Amount</p>
                  <p className="text-xl font-serif font-medium text-gray-800">PKR {grandTotal.toFixed(2)}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleOrderConfirmation}
                    className={`px-6 py-2.5 text-sm font-medium text-white rounded-xl transition-all ${
                      isSubmitting
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gray-900 hover:bg-gray-800 hover:shadow-lg"
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
          </div>
        </div>
      )}
    </>
  );
};

export default OrderSummary;