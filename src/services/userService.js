import { api } from "./AuthService";

const USER_BASE_URL = "/user";

const UserService = {

  // 1️⃣ Get All Users (ADMIN)
  getAllUsers: async () => {
    try {
      const response = await api.get(
        `${USER_BASE_URL}/admin/getAllUsers`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // 2️⃣ Get User By ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(
        `${USER_BASE_URL}/getUserById/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  },

  // 3️⃣ Get User By Email
  getUserByEmail: async (email) => {
    try {
      const response = await api.get(
        `${USER_BASE_URL}/getUserByEmail?email=${email}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  },

  // 4️⃣ Delete User (ADMIN)
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(
        `${USER_BASE_URL}/admin/deleteUser/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // 5️⃣ Get Currently Logged-in User
  getCurrentUser: async () => {
    try {
      const response = await api.get(
        `${USER_BASE_URL}/currentUser`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  },
};

export default UserService;