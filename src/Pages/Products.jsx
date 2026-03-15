import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import wishListService from "../services/wishlistService";
import { getUserId, isLoggedIn } from "../services/AuthHelper";
import Swal from "sweetalert2";
import cartService from "../services/cartService";
import productService from "../services/ProductService";
import CategoryService from "../services/CategoryService";


function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortType, setSortType] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryName = queryParams.get("category");

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        let data;

        if (categoryName) {
          const cat = await CategoryService.getCategoryByName(categoryName);
          data = await productService.getProductsByCategory(cat.categoryId);
        } else {
          data = await productService.getAllProducts();
        }

        setProducts(data);

        // Optional: fetch user's wishlist to mark added products
        if (isLoggedIn()) {
          const wishlist = await wishListService.getWishlist();
          setWishlistIds(wishlist.products.map(p => p.id));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  // ================= ADD TO CART =================
  const handleAddToCart = async (productId) => {
    if (!isLoggedIn()) {
      alert("Please login first!");
      return;
    }

    try {
      setAddingId(productId);
      const userId = getUserId();

      await cartService.addToCart(userId, productId, 1);
      alert("✅ Product Added To Cart");

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("❌ Failed to add product");
    } finally {
      setAddingId(null);
    }
  };

  // ================= TOGGLE WISHLIST =================
  const handleToggleWishlist = async (productId) => {
    if (!isLoggedIn()) {
      alert("Please login first!");
      return;
    }

    try {
      if (wishlistIds.includes(productId)) {
        // remove from wishlist
        const updated = await wishListService.removeFromWishlist(productId);
        setWishlistIds(wishlistIds.filter(id => id !== productId));
        Swal.fire("Removed!", "Product removed from wishlist", "success");
      } else {
        // add to wishlist
        const updated = await wishListService.addToWishlist(productId);
        setWishlistIds([...wishlistIds, productId]);
        Swal.fire("Added!", "Product added to wishlist", "success");
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      Swal.fire("Error", "Failed to update wishlist", "error");
    }
  };

  // ================= FILTER + SORT =================
  let filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      product.price >= minPrice &&
      product.price <= maxPrice
  );

  if (sortType === "low") filteredProducts.sort((a, b) => a.price - b.price);
  if (sortType === "high") filteredProducts.sort((a, b) => b.price - a.price);

  return (
    <div className="products-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Filters</h3>
        <input
          type="text"
          placeholder="🔍 Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="price-section">
          <label>Min Price: ₹{minPrice}</label>
          <input
            type="range"
            min="0"
            max="100000"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
          <label>Max Price: ₹{maxPrice}</label>
          <input
            type="range"
            min="0"
            max="100000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <div className="sort-section">
          <label>Sort By</label>
          <select onChange={(e) => setSortType(e.target.value)}>
            <option value="">Default</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-content">
        <h2>{categoryName ? `${categoryName} Products` : "All Products"}</h2>

        {loading ? (
          <div className="loader"></div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <h3>No Products Found</h3>
            <p>Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : "🛍️"}

                  {/* Wishlist Heart Icon */}
                  <span
                    className={`wishlist-heart ${wishlistIds.includes(product.id) ? "added" : ""}`}
                    onClick={() => handleToggleWishlist(product.id)}
                  >
                    ♥
                  </span>
                </div>
                <h4>{product.name}</h4>
                <p className="desc">{product.description}</p>
                <p className="price">₹{product.price}</p>
                <button
                  className="cart-btn"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={addingId === product.id}
                >
                  {addingId === product.id ? "Adding..." : "Add To Cart"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Internal CSS */}
      <style>{`
        .products-container{display:flex;min-height:100vh;background:#f4f6fb;}
        .sidebar{width:260px;padding:25px;background:white;box-shadow:2px 0 10px rgba(0,0,0,0.05);}
        .sidebar h3{margin-bottom:20px;}
        .sidebar input[type="text"]{width:100%;padding:10px;border-radius:8px;border:1px solid #ddd;margin-bottom:20px;}
        .price-section{margin-bottom:20px;}
        .price-section input{width:100%;}
        .sort-section select{width:100%;padding:8px;border-radius:8px;border:1px solid #ddd;}
        .products-content{flex:1;padding:40px;}
        .products-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:25px;}
        .product-card{background:white;padding:20px;border-radius:15px;box-shadow:0 5px 20px rgba(0,0,0,0.08);transition:0.3s;text-align:center;position:relative;}
        .product-card:hover{transform:translateY(-10px);box-shadow:0 20px 40px rgba(0,0,0,0.15);}
        .product-image img{width:100%;height:180px;object-fit:cover;border-radius:12px;}
        .product-image{position:relative;}
        .wishlist-heart{position:absolute;top:12px;right:12px;font-size:28px;cursor:pointer;color:#ccc;transition:color 0.3s, transform 0.3s;z-index:2;text-shadow:0 2px 4px rgba(0,0,0,0.3);}
        .wishlist-heart:hover{transform:scale(1.3);color:#e74c3c;}
        .wishlist-heart.added{color:#e74c3c;}
        .price{color:#ff6b00;font-size:20px;font-weight:bold;margin:10px 0;}
        .cart-btn{background:linear-gradient(135deg,#ff6b00,#ff9800);border:none;padding:10px 18px;color:white;border-radius:10px;cursor:pointer;transition:0.3s;}
        .cart-btn:hover{transform:scale(1.05);}
        .loader{border:6px solid #f3f3f3;border-top:6px solid #ff6b00;border-radius:50%;width:50px;height:50px;animation:spin 1s linear infinite;margin:50px auto;}
        @keyframes spin{0%{ transform:rotate(0deg); }100%{ transform:rotate(360deg);}}
        .empty-state{text-align:center;padding:60px;background:white;border-radius:15px;box-shadow:0 5px 15px rgba(0,0,0,0.08);}
        @media(max-width:900px){.products-container{flex-direction:column;}.sidebar{width:100%;box-shadow:none;}}
      `}</style>
    </div>
  );
}

export default Products;