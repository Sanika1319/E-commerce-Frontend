import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderService from "../services/OrderService";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const data = await OrderService.getOrdersByUser(user.id);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-primary";
      case "SHIPPED":
        return "bg-warning text-dark";
      case "DELIVERED":
        return "bg-success";
      case "CANCELLED":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading your orders...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center fw-bold">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center mt-5">
          <h5>No orders found</h5>
          <button
            className="btn btn-dark mt-3"
            onClick={() => navigate("/products")}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => (
            <div key={order.id} className="col-md-6 col-lg-4">
              <div
                className="card shadow-sm border-0 h-100"
                style={{
                  transition: "0.3s",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/orders/${order.id}`)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div className="card-body d-flex flex-column justify-content-between">
                  
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0">Order #{order.id}</h5>
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <p className="text-muted mb-1">
                      📅 {formatDate(order.date)}
                    </p>

                    <p className="fw-semibold mb-3">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>

                  <button className="btn btn-outline-dark btn-sm w-100">
                    View Details
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;