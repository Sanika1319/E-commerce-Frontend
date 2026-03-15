// src/services/AddressService.js
import axiosInstance from "./axiosInstance";

const AddressService = {
  // Add a new address for a user
  addAddress: async (userId, address) => {
    const res = await axiosInstance.post(`/address/addAddress/${userId}`, address);
    return res.data;
  },

  // Get a single address by its ID
  getAddressById: async (addressId) => {
    const res = await axiosInstance.get(`/address/getAddressById/${addressId}`);
    return res.data;
  },

  // Get all addresses for a specific user
  getAddressesByUser: async (userId) => {
    const res = await axiosInstance.get(`/address/getAddressesByUser/${userId}`);
    return res.data;
  },

  // Update a specific address for a user
  updateAddress: async (userId, addressId, address) => {
    const res = await axiosInstance.put(`/address/updateAddress/${userId}/${addressId}`, address);
    return res.data;
  },

  // Delete a specific address
  deleteAddress: async (addressId) => {
    const res = await axiosInstance.delete(`/address/deleteAddress/${addressId}`);
    return res.data;
  },
};

export default AddressService;
