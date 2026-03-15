// wishListService.js
import { api } from "./AuthService"; // using your auth-enabled axios instance
import { getUserId } from "./AuthHelper";

const BASE_URL = "/wishList";

const wishListService = {

  // Add a product to wishlist
  addToWishlist: async (productId) => {
    const userId = getUserId();
    if (!userId) throw new Error("User not logged in");

    const response = await api.post(`${BASE_URL}/add/${userId}/${productId}`);
    return response.data;
  },

  // Get current user's wishlist
  getWishlist: async () => {
    const userId = getUserId();
    if (!userId) throw new Error("User not logged in");

    const response = await api.get(`${BASE_URL}/user/${userId}`);
    return response.data;
  },

  // Remove a product from wishlist
  removeFromWishlist: async (productId) => {
    const userId = getUserId();
    if (!userId) throw new Error("User not logged in");

    const response = await api.delete(`${BASE_URL}/remove/${userId}/${productId}`);
    return response.data;
  }
};

export default wishListService;