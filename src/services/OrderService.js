import { api } from "./AuthService";



const ORDER_BASE_URL = "/Orders";

const OrderService = {

  // Get all orders (admin)
  getAllOrders: async () => {
    const res = await api.get(
      `${ORDER_BASE_URL}/allOrders`
    );
    return res.data;
  },

  // Get orders by user
  getOrdersByUser: async (userId) => {
    const res = await api.get(
      `${ORDER_BASE_URL}/user/${userId}`
    );
    return res.data;
  },

  // Get single order
  getOrderById: async (orderId) => {
    const res = await api.get(
      `${ORDER_BASE_URL}/${orderId}`
    );
    return res.data;
  },
};

export default OrderService;