import { api } from "./authService";

const ORDER_BASE_URL = "/Orders";

const orderService = {

   // ============================
  // PLACE ORDER
  // ============================
  placeOrder: async (userId) => {
  const res = await api.post(
    `${ORDER_BASE_URL}/placeOrder/${userId}`   // ✅ FIXED
  );
  return res.data;
},
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
  // ============================
  // ORDER STATUS FILTERS
  // ============================
  getPlacedOrders: async () => {
    const res = await api.get(`${ORDER_BASE_URL}/getPlacedOrders`);
    return res.data;
  },

  getOnTheWayOrders: async () => {
    const res = await api.get(`${ORDER_BASE_URL}/getOnTheWayOrders`);
    return res.data;
  },

  getDeliveredOrders: async () => {
    const res = await api.get(`${ORDER_BASE_URL}/getDeliveredOrders`);
    return res.data;
  },

  getCancelledOrders: async () => {
    const res = await api.get(`${ORDER_BASE_URL}/getCancelledOrders`);
    return res.data;
  },

  // ============================
  // CANCEL ORDER
  // ============================
  cancelOrder: async (orderId) => {
    const res = await api.delete(
      `${ORDER_BASE_URL}/cancelOrder/${orderId}`
    );
    return res.data;
  },

  // ============================
  // ORDER STATS (FOR PROFILE PAGE)
  // ============================
  getOrderStatsByUser: async (userId) => {
    const orders = await api.get(
      `${ORDER_BASE_URL}/getOrdersByUser/${userId}`
    );

    const total = orders.data.length;
    const placed = orders.data.filter(o => o.status === "PLACED").length;
    const cancelled = orders.data.filter(o => o.status === "CANCELLED").length;

    return { total, placed, cancelled };
  }
};

export default orderService;