import { api } from "./AuthService";

const BASE_URL = "/product";

const productService = {

  // Get all products
  getAllProducts: async () => {
    const res = await api.get(`${BASE_URL}/getAllProducts`);
    return res.data;
  },

  // Get product by ID
  getProductById: async (productId) => {
    const res = await api.get(`${BASE_URL}/getProductById/${productId}`);
    return res.data;
  },

  // Create product (Admin)
  createProduct: async (categoryId, product) => {
    const res = await api.post(`${BASE_URL}/createProduct/${categoryId}`, product);
    return res.data;
  },

  // Update product
  updateProduct: async (productId, product) => {
    const res = await api.put(`${BASE_URL}/updateProduct/${productId}`, product);
    return res.data;
  },

  // Delete product
  deleteProduct: async (productId) => {
    const res = await api.delete(`${BASE_URL}/delete/${productId}`);
    return res.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    const res = await api.get(`${BASE_URL}/getProductsByCategory/${categoryId}`);
    return res.data;
  },

  // Search product by name
  searchProductByName: async (keyword) => {
    const res = await api.get(`${BASE_URL}/searchProductByName?keyword=${keyword}`);
    return res.data;
  },

  // Get products in price range
  getProductsByPriceRange: async (min, max) => {
    const res = await api.get(`${BASE_URL}/getProductsByPriceRange?min=${min}&max=${max}`);
    return res.data;
  },

  // Low stock products
  getLowStockProducts: async () => {
    const res = await api.get(`${BASE_URL}/getLowStockProducts`);
    return res.data;
  },

  // Out of stock products
  getOutOfStockProducts: async () => {
    const res = await api.get(`${BASE_URL}/getOutOfStockProducts`);
    return res.data;
  }

};

export default productService;