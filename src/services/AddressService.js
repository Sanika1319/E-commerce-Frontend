// src/services/AddressService.js
import { api } from "./authService";


const AddressService = {
  // Add a new address for a user
  addAddress: async (userId, address) => {
    const res = await api.post(`/address/addAddress/${userId}`, address);
    return res.data;
  },

  // Get a single address by its ID
  getAddressById: async (addressId) => {
    const res = await api.get(`/address/getAddressById/${addressId}`);
    return res.data;
  },

  // Get all addresses for a specific user
  getAddressesByUser: async (userId) => {
    const res = await api.get(`/address/getAddressesByUser/${userId}`);
    return res.data;
  },

  // Update a specific address for a user
  updateAddress: async (userId, addressId, address) => {
    const res = await api.put(`/address/updateAddress/${userId}/${addressId}`, address);
    return res.data;
  },

  // Delete a specific address
  deleteAddress: async (addressId) => {
    const res = await api.delete(`/address/deleteAddress/${addressId}`);
    return res.data;
  },
};

export default AddressService;
