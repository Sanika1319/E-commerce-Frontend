import axios from "axios";

const BASE_URL = "https://pacific-unity-production.up.railway.app"; //base url

// object AXIOS
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, //heandling cookies cross origin
});

// response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401: // unauthorized, redirect user to login or logout
          authService.logout();
          // window.location.href = "/login";
          break;

        case 403: // forbidden
          console.error("Access forbidden");
          break;

        case 404: // resource not found
          console.error("Resource not found");
          break;

        case 500:
          console.error("Internal server error");
          break;
      }
    } else if (error.request) {
      // request made but no response recived
      console.error("No response recived ", error.request);
    } else {
      // something happend in setting up the request
      console.error("Error in setting up request ", error.message);
    }
    return Promise.reject(error);
  }
);
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
const authService ={
    // register

 register: async (name, email, password) => {
  try {
    const payload = {
      name,
      email,
      password
    };

    const response = await api.post(`/auth/register`, payload);
    console.log(response.data, "from Service")
    return response.data;

  } catch (error) {
    console.error("Registration failed", error);
    throw error;
  }
},



   //  Login
  login: async (email, password) => {
    localStorage.removeItem("token");
    try {
      const response = await  api.post("/auth/login", {
         email,
         password,
      });
    
      const token = response.data;
     

      //  store token

      localStorage.setItem("token", token);

      // return

      return {
        token: token,
      };
    } catch (error) {
      console.error("Fail to login ", error);
      throw error;
    }
  },
  currentUser: async()=>{
    try {
       const response = await api.get(`/user/currentUser`);
        
           localStorage.setItem("user", JSON.stringify(response.data));
         

            return response.data;
    } catch (error) {
      console.error('Fail to load current logged in user')
            throw error;

    }
  },
  logout:()=>{
    localStorage.removeItem('token')
  }
}

export { api, authService };