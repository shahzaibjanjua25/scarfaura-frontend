import emailjs from '@emailjs/browser';

export const sendOrderNotification = async (orderData) => {
  try {
    const templateParams = {
      order_id: responseData.orderId || responseData._id,
      customer_name: formData.name,
      customer_email: user?.email || "N/A",
      customer_phone: formData.phone,
      order_date: new Date().toLocaleString(),
      order_items: products.map(item =>
        `${item.name} (x${item.quantity}) - PKR ${(item.price * item.quantity).toFixed(2)}`
      ).join('\n'), // ✅ convert array to string

      subtotal: `PKR ${totalPrice.toFixed(2)}`,
      delivery_charge: `PKR ${deliveryCharge.toFixed(2)}`,
      grand_total: `PKR ${grandTotal.toFixed(2)}`,

      shipping_address: [
        formData.address,
        formData.city,
        formData.state,
        formData.postalCode
      ].filter(Boolean).join('\n'), // ✅ convert object to string

      payment_method: "Cash on Delivery",
      customer_notes: formData.notes || "N/A"
    };


    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
    

    return { success: true };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return { success: false, error: error.message };
  }
};