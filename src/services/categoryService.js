import { api } from "./authService";

const categoryService = {

  createCategory: async (category) => {
    const res = await api.post("/category/addCategory", category);
    return res.data;
  },

  getAllCategories: async () => {
    const res = await api.get("/category/getAllCategory");
    return res.data;
  },

  getCategoryById: async (categoryId) => {
    const res = await api.get(`/category/getCategoryById/${categoryId}`);
    return res.data;
  },

  getCategoryByName: async (categoryName) => {
    const res = await api.get(`/category/getCategoryByName?categoryName=${categoryName}`);
    return res.data;
  },

  updateCategory: async (categoryId, category) => {
    const res = await api.put(`/category/updateCategory/${categoryId}`, category);
    return res.data;
  },

  activateCategory: async (id) => {
    const res = await api.put(`/category/activate/${id}`);
    return res.data;
  },

  deactivateCategory: async (oldCategoryId, newCategoryId) => {
    const res = await api.put(`/category/deactivate/${oldCategoryId}/${newCategoryId}`);
    return res.data;
  }

};

export default categoryService;