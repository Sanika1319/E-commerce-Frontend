import React, { useEffect, useState } from "react";
import wishListService from "../services/wishlistService";
import Swal from "sweetalert2";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishListService.getWishlist();
      setWishlist(data);
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
      Swal.fire("Error", "Failed to load wishlist", "error");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (productId) => {
    try {
      const updatedWishlist = await wishListService.removeFromWishlist(productId);
      setWishlist(updatedWishlist);
      Swal.fire("Removed!", "Product removed from wishlist", "success");
    } catch (err) {
      console.error("Failed to remove product", err);
      Swal.fire("Error", "Failed to remove product", "error");
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  if (loading)
    return <p className="wishlist-message">Loading your wishlist...</p>;

  if (!wishlist || wishlist.products.length === 0)
    return <p className="wishlist-message">Your wishlist is empty!</p>;

  return (
    <div className="wishlist-container">
      <style>{`
        .wishlist-container {
          padding: 2rem;
          max-width: 1200px;
          margin: auto;
        }
        .wishlist-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 2rem;
          text-align: center;
        }
        .wishlist-items {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.8rem;
        }
        .wishlist-card {
          display: flex;
          flex-direction: row;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .wishlist-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 18px 40px rgba(0,0,0,0.15);
        }
        .wishlist-image {
          flex: 1;
          min-width: 150px;
          max-width: 200px;
          overflow: hidden;
        }
        .wishlist-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .wishlist-card:hover .wishlist-image img {
          transform: scale(1.05);
        }
        .wishlist-details {
          flex: 2;
          padding: 1rem 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          justify-content: center;
        }
        .wishlist-details h3 {
          font-size: 1.3rem;
          color: #2c3e50;
          margin: 0;
        }
        .wishlist-details .description {
          font-size: 0.95rem;
          color: #7f8c8d;
          flex-grow: 1;
        }
        .wishlist-price-quantity {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
        }
        .price-badge {
          background: linear-gradient(135deg, #ff6b00, #ff9800);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .quantity-pill {
          background-color: #ecf0f1;
          color: #34495e;
          padding: 0.3rem 0.8rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .btn-remove {
          background-color: #e74c3c;
          color: #fff;
          border: none;
          padding: 0.7rem 1rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          margin-top: 1rem;
          transition: all 0.3s ease;
          align-self: flex-start;
        }
        .btn-remove:hover {
          background-color: #c0392b;
          transform: scale(1.05);
        }
        .wishlist-message {
          text-align: center;
          font-size: 1.2rem;
          color: #7f8c8d;
          padding: 2rem;
        }

        @media (max-width: 800px) {
          .wishlist-card {
            flex-direction: column;
            align-items: center;
          }
          .wishlist-image {
            max-width: 100%;
            height: 220px;
          }
          .wishlist-details {
            align-items: center;
            text-align: center;
          }
          .wishlist-price-quantity {
            flex-direction: column;
            gap: 0.4rem;
          }
        }
      `}</style>

      <h2 className="wishlist-title">Your Wishlist</h2>
      <div className="wishlist-items">
        {wishlist.products.map((product) => (
          <div key={product.id} className="wishlist-card">
            <div className="wishlist-image">
              <img src={product.imageUrl} alt={product.name} />
            </div>
            <div className="wishlist-details">
              <h3>{product.name}</h3>
              <p className="description">{product.description}</p>
              <div className="wishlist-price-quantity">
                <span className="price-badge">₹{product.price}</span>
                <span className="quantity-pill">Qty: {product.quantity}</span>
              </div>
              <button
                className="btn-remove"
                onClick={() => removeProduct(product.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;