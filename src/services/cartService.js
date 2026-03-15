import axiosInstance from "./axiosInstance"

const cartService ={
    getCart: (userId) =>{
        return axiosInstance.get(`/cart/getCartByUserId/${userId}`)
    },
    addToCart : (userId, productId, quantity) =>{
        return axiosInstance.post(`/cart/addProducts/${userId}/${productId}`
            ,
      null,
      { params: { quantity } }
        );
    },

    removeFromCart: (userId, productId) => {
    return axiosInstance.delete(`/cart/removeProductFromCart/${userId}/${productId}`);
  },

  clearCart: (userId) => {
    return axiosInstance.delete(`/cart/clearCart/${userId}`);
  },

};

export default cartService;