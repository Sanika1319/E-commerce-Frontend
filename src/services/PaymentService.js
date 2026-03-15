import axiosInstance from "./axiosInstance";

const PaymentService = {

  // 1️⃣ Create Razorpay Order
  createOrder: async (userId) => {
    return await axiosInstance.post(`/Orders/createOrder/${userId}`);
  },

  // 2️⃣ Verify Payment
  verifyPayment: async (orderId, paymentData) => {
    return await axiosInstance.post("/Orders/verify", null, {
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