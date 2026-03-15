import { api } from "./authService";


const cartService ={
    getCart: (userId) =>{
        return api.get(`/cart/getCartByUserId/${userId}`)
    },
    addToCart : (userId, productId, quantity) =>{
        return api.post(`/cart/addProducts/${userId}/${productId}`
            ,
      null,
      { params: { quantity } }
        );
    },

    removeFromCart: (userId, productId) => {
    return api.delete(`/cart/removeProductFromCart/${userId}/${productId}`);
  },

  clearCart: (userId) => {
    return api.delete(`/cart/clearCart/${userId}`);
  },

};

export default cartService;