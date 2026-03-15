import { api } from "./authService";

const ORDER_BASE_URL = "/Orders";

const orderService = {
  getAllOrders: async () => {
    const res = await api.get(`${ORDER_BASE_URL}/allOrders`);
    return res.data;
  },

  getOrdersByUser: async (userId) => {
    const res = await api.get(`${ORDER_BASE_URL}/user/${userId}`);
    return res.data;
  },

  getOrderById: async (orderId) => {
    const res = await api.get(`${ORDER_BASE_URL}/${orderId}`);
    return res.data;
  },
};

export default orderService;