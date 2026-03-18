import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderService from "../services/OrderService";
import Swal from "sweetalert2";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id; // ✅ FIXED

  // ============================
  // FETCH ORDERS
  // ============================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      if (!userId) {
        console.error("User ID missing!");
        setOrders([]);
        return;
      }

      const data = await OrderService.getOrdersByUser(userId);
      console.log("Orders:", data); // 🔥 DEBUG

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]); // prevent infinite loading
    } finally {
      setLoading(false); // ✅ ALWAYS stop loader
    }
  };

  useEffect(() => {
    if (!userId) {
      console.error("User ID is missing!");
      setLoading(false);
      return;
    }

    fetchOrders();
  }, [userId]);

  // ============================
  // CANCEL ORDER
  // ============================
  const handleCancel = async (id) => {
     console.log("Cancel clicked ID:", id);
    const result = await Swal.fire({
      title: "Cancel Order?",
      text: "If already paid, refund will be initiated.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setCancellingId(id);

      const res = await OrderService.cancelOrder(id);

      // ✅ REFUND POPUP
      if (res.refunded) {
        await Swal.fire({
          title: "Refund Successful 💰",
          text: "Your payment has been refunded successfully!",
          icon: "success",
        });
      } else {
        await Swal.fire({
          title: "Order Cancelled",
          text: "No refund required (COD order)",
          icon: "success",
        });
      }

      await fetchOrders();
    } catch (err) {
      console.error(err);

      Swal.fire({
        title: "Error ❌",
        text: err?.response?.data || "Cancel failed",
        icon: "error",
      });
    } finally {
      setCancellingId(null);
    }
  };

  // ============================
  // HELPERS
  // ============================
  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "N/A");

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const getStatusBadge = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-warning text-dark";
      case "ON_THE_WAY":
        return "bg-info";
      case "DELIVERED":
        return "bg-success";
      case "CANCELLED":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  // ============================
  // LOADING
  // ============================
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  // ============================
  // EMPTY STATE
  // ============================
  if (orders.length === 0) {
    return (
      <div className="text-center mt-5">
        <h4>No Orders Found 😕</h4>
        <button
          className="btn btn-dark mt-3"
          onClick={() => navigate("/products")}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  // ============================
  // UI
  // ============================
  return (
    <div className="container mt-5">
      {/* HEADER */}
      <div
        className="text-center text-white py-4 mb-4"
        style={{
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          borderRadius: "15px",
        }}
      >
        <h2 className="fw-bold">My Orders 🛒</h2>
        <p className="mb-0">Track and manage your purchases</p>
      </div>

      {/* ORDERS GRID */}
      <div className="row g-4">
        {orders.map((order) => (
          <div key={order.orderId} className="col-md-6 col-lg-4">
            <div
              className="card h-100 border-0 shadow-lg"
              style={{
                borderRadius: "18px",
                transition: "all 0.3s ease",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              {/* CARD BODY */}
              <div className="card-body d-flex flex-column justify-content-between">
                {/* TOP */}
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark">
                      🧾 Order #{order.orderId}
                    </h5>

                    <span
                      className={`badge px-3 py-2 ${getStatusBadge(order.status)}`}
                      style={{ borderRadius: "20px", fontSize: "0.8rem" }}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Divider */}
                  <hr style={{ opacity: 0.2 }} />

                  {/* DETAILS */}
                  <p className="text-muted mb-2">
                    📅 <strong>Date:</strong> {formatDate(order.createdAt)}
                  </p>

                  <p className="mb-2 fs-5 fw-bold text-success">
                    💰 {formatCurrency(order.totalAmount)}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="mt-3 d-flex gap-2">
                  <button
                    className="btn btn-primary btn-sm w-100"
                    style={{
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #36d1dc, #5b86e5)",
                      border: "none",
                    }}
                    onClick={() => navigate(`/track-order/${order.id}`)}
                  >
                    🚚 Track
                  </button>

                  {order.status === "PLACED" && (
                    <button
                      className="btn btn-outline-danger btn-sm w-100"
                      style={{ borderRadius: "10px" }}
                      onClick={() => handleCancel(order.id)}
                      disabled={cancellingId === order.id}
                    >
                      {cancellingId === order.id
                        ? "Cancelling..."
                        : "❌ Cancel"}
                    </button>
                  )}
                  {/* ✅ REFUND SUCCESS */}
                  {order.status === "CANCELLED" &&
                    order.payment?.status === "REFUNDED" && (
                      <p className="text-success fw-bold mt-2">
                        ✅ ₹{order.totalAmount} Refunded Successfully
                      </p>
                    )}

                  {/* ⏳ REFUND PROCESSING */}
                  {order.status === "CANCELLED" &&
                    order.payment?.status === "PAID" && (
                      <p className="text-warning fw-bold mt-2">
                        ⏳ Refund is being processed...
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrdersPage;
