import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../redux/features/cart/cartSlice";
import { getBaseUrl } from "../../utils/baseURL";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const { cartItems, totalAmount } = location.state || {};

  const deliveryCharge = 200;
  const subtotal = totalAmount;
  const grandTotal = subtotal + deliveryCharge;

  const [formData, setFormData] = useState({
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "Cash on Delivery",
    specialInstructions: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.email || !formData.phone || !formData.address) {
        alert("Please fill in all required fields");
        return;
      }

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
console.log("Submitting order:", orderData);


      const response = await fetch(`${getBaseUrl()}/api/orders/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user.token && { Authorization: `Bearer ${user.token}` })
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create order");
      }

      dispatch(clearCart());
      navigate(`/order-confirmation/${responseData.orderId || responseData._id}`);

    } catch (error) {
      console.error("Order placement error:", error);
      alert(`Order failed: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Phone Number*</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Shipping Address*</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                rows="3"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#374151', marginBottom: '0.5rem' }}>
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.375rem'
                  }}
                >
                  <option value="">Select a state</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad Capital Territory">Islamabad</option>
                  <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  <option value="Azad Kashmir">Azad Kashmir</option>
                </select>
              </div>

            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Special Instructions</label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                rows="2"
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Place Order
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item._id} className="flex justify-between border-b pb-4">
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="font-medium">
                  PKR {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>PKR {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Delivery Charges:</span>
                <span>PKR {deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>PKR {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
