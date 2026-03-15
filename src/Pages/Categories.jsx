import CategoryService from "../services/categoryService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLaptop, FaTshirt, FaBook, FaFootballBall, FaCouch } from "react-icons/fa";

function Categories() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    CategoryService.getAllCategories()
      .then(data => setCategories(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const openCategory = (name) => {
    navigate(`/products?category=${name}`);
  };

  const getIcon = (name) => {
    switch(name.toLowerCase()) {
      case "electronics":
        return <FaLaptop />;
      case "fashion":
        return <FaTshirt />;
      case "books":
        return <FaBook />;
      case "sports":
        return <FaFootballBall />;
      default:
        return <FaCouch />;
    }
  };

  return (

    <div className="category-page">

      {/* HERO SECTION */}
      <div className="hero">
        <h1>Explore Our Categories</h1>
        <p>Find the perfect products across all collections</p>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="category-grid">

          {categories.map((cat) => (

            <div
              key={cat.categoryId}
              className="category-card"
              onClick={() => openCategory(cat.categoryName)}
            >

              <div className="icon-wrapper">
                {getIcon(cat.categoryName)}
              </div>

              <h3>{cat.categoryName}</h3>

              <span className="badge">
                {Math.floor(Math.random()*40)+10}+ Products
              </span>

            </div>

          ))}

        </div>
      )}

      <style>{`

      .category-page{
        min-height:100vh;
        padding:40px;
        background:linear-gradient(135deg,#667eea,#764ba2);
        color:white;
      }

      .hero{
        text-align:center;
        margin-bottom:50px;
      }

      .hero h1{
        font-size:40px;
        margin-bottom:10px;
        font-weight:700;
      }

      .hero p{
        opacity:0.9;
      }

      .category-grid{
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
        gap:30px;
      }

      .category-card{
        background:rgba(255,255,255,0.15);
        backdrop-filter:blur(12px);
        border-radius:20px;
        padding:35px 25px;
        text-align:center;
        cursor:pointer;
        transition:all 0.4s ease;
        border:1px solid rgba(255,255,255,0.2);
      }

      .category-card:hover{
        transform:translateY(-12px) scale(1.03);
        box-shadow:0 25px 50px rgba(0,0,0,0.3);
        background:rgba(255,255,255,0.25);
      }

      .icon-wrapper{
        font-size:45px;
        margin-bottom:20px;
        background:linear-gradient(135deg,#ff9a9e,#fad0c4);
        width:80px;
        height:80px;
        display:flex;
        align-items:center;
        justify-content:center;
        border-radius:50%;
        margin-left:auto;
        margin-right:auto;
        color:#333;
        box-shadow:0 10px 20px rgba(0,0,0,0.2);
      }

      .category-card h3{
        margin-bottom:10px;
        font-weight:600;
      }

      .badge{
        display:inline-block;
        margin-top:10px;
        background:linear-gradient(135deg,#ff6b00,#ff9800);
        color:white;
        padding:6px 15px;
        border-radius:30px;
        font-size:13px;
        font-weight:500;
      }

      .loader{
        border:6px solid rgba(255,255,255,0.2);
        border-top:6px solid white;
        border-radius:50%;
        width:50px;
        height:50px;
        animation:spin 1s linear infinite;
        margin:50px auto;
      }

      @keyframes spin{
        0%{ transform:rotate(0deg); }
        100%{ transform:rotate(360deg); }
      }

      @media(max-width:768px){
        .hero h1{
          font-size:28px;
        }
      }

      `}</style>

    </div>
  );
}

export default Categories;