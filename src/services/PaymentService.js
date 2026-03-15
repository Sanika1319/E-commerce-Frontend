import { api } from "./AuthService";

const PaymentService = {

  // 1️⃣ Create Razorpay Order
  createOrder: async (userId) => {
    return await api.post(`/Orders/createOrder/${userId}`);
  },

  // 2️⃣ Verify Payment
  verifyPayment: async (orderId, paymentData) => {
    return await api.post("/Orders/verify", null, {
      params: {
        orderId: orderId,
        razorpayPaymentId: paymentData.razorpay_payment_id,
        razorpayOrderId: paymentData.razorpay_order_id,
        razorpaySignature: paymentData.razorpay_signature,
      },
    });
  },

};

export default PaymentService;