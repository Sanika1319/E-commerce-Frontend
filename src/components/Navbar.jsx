import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { authService } from "../services/authService";

const Navbar = () => {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(sessionStorage.getItem("user"));
  } catch {
    user = null;
  }

  const isLoggedIn = !!token;
  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {

    authService.logout();

    Swal.fire({
      title: "Logged Out Successfully 👋",
      text: "See you again soon!",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm border-bottom border-secondary">
        <div className="container-fluid px-4">

          <Link className="navbar-brand fw-bold fs-2 text-warning" to="/">
            🛒 Shop<span className="text-light">Ease</span>
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileSidebar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse d-none d-lg-flex">

            <ul className="navbar-nav mx-auto gap-4">

              <li className="nav-item">
                <Link className="nav-link text-light fw-semibold" to="/">Home</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-light fw-semibold" to="/products">Products</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-light fw-semibold" to="/categories">Categories</Link>
              </li>

              {isLoggedIn && (
                <li className="nav-item">
                  <Link className="nav-link text-light fw-semibold" to="/orders">Orders</Link>
                </li>
              )}

              <li className="nav-item">
              <Link
                className="nav-link fw-semibold position-relative"
                to="/wishlist"
              >
                Wishlist
              </Link>
            </li>

              {isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link text-warning fw-semibold" to="/adminPanel">
                    Admin Dashboard
                  </Link>
                </li>
              )}

            </ul>

            <div className="d-flex align-items-center gap-3">

              <Link to="/cart" className="position-relative text-warning fs-5">
                <FaShoppingCart />
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.65rem" }}
                >
                  0
                </span>
              </Link>

              <div className="dropdown">

                <button
                  className="btn btn-outline-light dropdown-toggle rounded-pill"
                  data-bs-toggle="dropdown"
                >
                  <FaUserCircle className="me-1" />
                  Account
                </button>

                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">

                  {isLoggedIn ? (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          👤 Profile
                        </Link>
                      </li>

                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={handleLogout}
                        >
                          🚪 Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/login">
                          🔑 Login
                        </Link>
                      </li>

                      <li>
                        <Link className="dropdown-item" to="/register">
                          📝 Register
                        </Link>
                      </li>
                    </>
                  )}

                </ul>

              </div>

            </div>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;