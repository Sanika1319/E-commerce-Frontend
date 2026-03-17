import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import orderService from "../services/OrderService";

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // ============================
  // FETCH ORDER
  // ============================
  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(Number(orderId));;
      setOrder(data);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  // ============================
  // CANCEL ORDER
  // ============================
  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      setCancelling(true);
      await orderService.cancelOrder(orderId);
      await fetchOrder(); // refresh status
    } catch (err) {
      console.error("Cancel failed:", err);
    } finally {
      setCancelling(false);
    }
  };

  // ============================
  // STATUS PROGRESS
  // ============================
  const getProgress = () => {
    switch (order?.status) {
      case "PLACED":
        return 25;
      case "ON_THE_WAY":
        return 60;
      case "DELIVERED":
        return 100;
      case "CANCELLED":
        return 100;
      default:
        return 0;
    }
  };

  const getStatusColor = () => {
    switch (order?.status) {
      case "PLACED":
        return "#ffc107";
      case "ON_THE_WAY":
        return "#0dcaf0";
      case "DELIVERED":
        return "#198754";
      case "CANCELLED":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  // ============================
  // LOADING
  // ============================
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (!order) {
    return <h4 className="text-center mt-5">Order not found 😕</h4>;
  }

  // ============================
  // UI
  // ============================
  return (
  <div className="container mt-5">

    {/* HEADER */}
    <div
      className="text-white text-center py-4 mb-4"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        borderRadius: "15px"
      }}
    >
      <h2 className="fw-bold">Track Order 🚚</h2>
      <p className="mb-0">Order #{order.orderId}</p>
    </div>

    {/* CARD */}
    <div
      className="card border-0 shadow-lg p-4"
      style={{
        borderRadius: "20px",
        backdropFilter: "blur(10px)"
      }}
    >

      {/* STATUS BADGE */}
      <div className="text-center mb-4">
        <span
          style={{
            backgroundColor: getStatusColor(),
            color: "#fff",
            padding: "8px 18px",
            borderRadius: "25px",
            fontWeight: "600",
            fontSize: "14px"
          }}
        >
          {order.status}
        </span>
      </div>

      {/* TIMELINE TRACKER */}
      <div className="d-flex justify-content-between align-items-center mb-4 position-relative">

        {/* LINE */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "0",
            right: "0",
            height: "4px",
            background: "#e0e0e0",
            zIndex: 0
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "0",
            height: "4px",
            width: `${getProgress()}%`,
            background: getStatusColor(),
            zIndex: 1,
            transition: "0.5s"
          }}
        ></div>

        {["PLACED", "ON_THE_WAY", "DELIVERED"].map((step, index) => {
          const isActive =
            (step === "PLACED" && getProgress() >= 25) ||
            (step === "ON_THE_WAY" && getProgress() >= 60) ||
            (step === "DELIVERED" && getProgress() === 100);

          return (
            <div key={index} className="text-center" style={{ zIndex: 2 }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: isActive ? getStatusColor() : "#ccc",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  fontWeight: "bold"
                }}
              >
                {index + 1}
              </div>
              <small className="d-block mt-2">
                {step.replace("_", " ")}
              </small>
            </div>
          );
        })}
      </div>

      {/* DETAILS */}
      <div className="row text-center mb-4">
        <div className="col-md-4">
          <p className="text-muted mb-1">💰 Amount</p>
          <h6 className="fw-bold text-success">₹{order.totalAmount}</h6>
        </div>

        <div className="col-md-4">
          <p className="text-muted mb-1">📅 Created</p>
          <h6>{new Date(order.createdAt).toLocaleString()}</h6>
        </div>

        <div className="col-md-4">
          <p className="text-muted mb-1">📦 Updated</p>
          <h6>{new Date(order.statusUpdatedAt).toLocaleString()}</h6>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="d-flex gap-3">

        <button
          className="btn w-100"
          style={{
            background: "#6c757d",
            color: "#fff",
            borderRadius: "10px"
          }}
          onClick={() => navigate("/orders")}
        >
          🔙 Back
        </button>

        {order.status === "PLACED" && (
          <button
            className="btn w-100"
            style={{
              background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
              color: "#fff",
              borderRadius: "10px",
              border: "none"
            }}
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? "Cancelling..." : "❌ Cancel"}
          </button>
        )}

      </div>

    </div>
  </div>
);
};

export default TrackOrderPage;