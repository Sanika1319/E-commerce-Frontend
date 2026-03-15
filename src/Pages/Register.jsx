import { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const styles = {

    page:{
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"linear-gradient(135deg,#1f2937,#111827)"
    },

    card:{
      width:"420px",
      padding:"35px",
      borderRadius:"12px",
      background:"white",
      boxShadow:"0 10px 25px rgba(0,0,0,0.2)"
    },

    title:{
      textAlign:"center",
      marginBottom:"25px",
      fontWeight:"bold"
    },

    btn:{
      width:"100%",
      padding:"10px",
      borderRadius:"25px",
      background:"#f59e0b",
      border:"none",
      fontWeight:"bold"
    },

    link:{
      textAlign:"center",
      marginTop:"15px"
    }

  };

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await authService.register(
        formData.name,
        formData.email,
        formData.password,
        
        
      );
      console.log(formData)

      // Success Popup
      Swal.fire({
        title: "Registration Successful 🎉",
        text: "Your account has been created!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });

      setTimeout(() => {
        navigate("/login");
      },1500);

    } catch (error) {

      console.error(error);

      // Error Popup
      Swal.fire({
        title: "Registration Failed ❌",
        text: "Something went wrong. Try again!",
        icon: "error",
        confirmButtonColor:"#f59e0b"
      });

    }
  };

  return (

<div style={styles.page}>

<div style={styles.card}>

<h3 style={styles.title}>Create Account</h3>

<form onSubmit={handleSubmit}>

<div className="mb-3">
<label className="form-label">Full Name</label>
<input
type="text"
name="name"
className="form-control"
placeholder="Enter your name"
onChange={handleChange}
/>
</div>

<div className="mb-3">
<label className="form-label">Email</label>
<input
type="email"
name="email"
className="form-control"
placeholder="Enter your email"
onChange={handleChange}
/>
</div>



<div className="mb-3">
<label className="form-label">Password</label>
<input
type="password"
name="password"
className="form-control"
placeholder="Create password"
onChange={handleChange}
/>
</div>

<button type="submit" style={styles.btn}>
Register
</button>

</form>

<div style={styles.link}>

<p>
Already have an account?
<a href="/login"> Login</a>
</p>

</div>

</div>

</div>

  );
}

export default Register;