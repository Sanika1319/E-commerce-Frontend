import { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ADMIN_EMAIL = "admin@gmail.com"; // admin email

const LoginPage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const styles = {

    page: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg,#1f2937,#111827)"
    },

    card: {
      width: "400px",
      padding: "35px",
      borderRadius: "12px",
      background: "white",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
    },

    title: {
      textAlign: "center",
      marginBottom: "25px",
      fontWeight: "bold"
    },

    btn: {
      width: "100%",
      padding: "10px",
      borderRadius: "25px",
      background: "#f59e0b",
      border: "none",
      fontWeight: "bold"
    },

    link: {
      textAlign: "center",
      marginTop: "15px"
    }

  };

  // handle input
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  // handle login
  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {

      // LOGIN API
      const response = await authService.login(
        formData.email,
        formData.password
      );

      // GET USER DETAILS
      const user = await authService.currentUser();

      // ADMIN CHECK
      const isAdmin = formData.email === ADMIN_EMAIL;

      // STORE USER
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          role: isAdmin ? "ADMIN" : "USER"
        })
      );

      // STORE TOKEN
      localStorage.setItem("token", response.token);

      setLoading(false);

      Swal.fire({
        title: "Login Successful 🎉",
        text: "Welcome back!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {

      console.error("Login failed", error);

      setLoading(false);

      Swal.fire({
        title: "Login Failed ❌",
        text: "Invalid email or password",
        icon: "error",
        confirmButtonColor: "#f59e0b"
      });

    }

  };

  return (

    <div style={styles.page}>

      <div style={styles.card}>

        <h3 style={styles.title}>Login</h3>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Email</label>

            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>

            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>

          <button
            type="submit"
            style={styles.btn}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div style={styles.link}>

          <p>
            Don't have an account?
            <a href="/register"> Register</a>
          </p>

        </div>

      </div>

    </div>

  );

};

export default LoginPage;