import { api } from "./authService";

const PaymentService = {
  createOrder: (userId) =>
    api.post(`/payment/create/${userId}`),

  verifyPayment: (userId, payload) =>
    api.post(`/payment/verify/${userId}`, payload),
};

export default PaymentService;
