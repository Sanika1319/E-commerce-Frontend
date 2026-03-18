import { api } from "./authService";

const PAYMENT_BASE_URL = "/payment";

const PaymentService = {

  // ============================
  // CREATE RAZORPAY ORDER
  // ============================
  createOrder: async (userId) => {
    try {
      const res = await api.post(`${PAYMENT_BASE_URL}/create/${userId}`);
      return res.data; // ✅ return only data
    } catch (err) {
      console.error("Create order error:", err);
      throw err;
    }
  },

  // ============================
  // VERIFY PAYMENT
  // ============================
  verifyPayment: async (userId, payload) => {
    try {
      const res = await api.post(
        `${PAYMENT_BASE_URL}/verify/${userId}`,
        payload
      );
      return res.data; // ✅ return only data
    } catch (err) {
      console.error("Verify payment error:", err);
      throw err;
    }
  },

};

export default PaymentService;