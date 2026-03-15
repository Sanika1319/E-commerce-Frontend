import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderService from "../services/OrderService";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await OrderService.getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading Order Details...</h4>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mt-5 text-center">
        <h4>Order not found</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5">

      {/* Back Button */}
      <button
        className="btn btn-outline-dark mb-4"
        onClick={() => navigate("/orders")}
      >
        ← Back to Orders
      </button>

      {/* Order Header */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <div>
            <h4 className="fw-bold">Order #{order.id}</h4>
            <p className="text-muted mb-1">
              Placed on {formatDate(order.date)}
            </p>
          </div>

          <span className={`badge ${getStatusBadge(order.status)} p-2`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="row g-4">

        {/* Product Section */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="mb-4 fw-semibold">Ordered Products</h5>

              {order.orderItems?.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between align-items-center border-bottom py-3"
                >
                  <div className="d-flex align-items-center gap-3">
                    
                    {/* Product Image (Optional) */}
                    <img
                      src={item.product.imageUrl || "https://via.placeholder.com/60"}
                      alt={item.product.name}
                      width="60"
                      height="60"
                      className="rounded"
                      style={{ objectFit: "cover" }}
                    />

                    <div>
                      <h6 className="mb-1">{item.product.name}</h6>
                      <small className="text-muted">
                        Quantity: {item.quantity}
                      </small>
                    </div>
                  </div>

                  <div className="fw-semibold">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="mb-4 fw-semibold">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Total Amount</span>
                <span className="fw-bold">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>

              <hr />

              {order.payment && (
                <p className="mb-2">
                  <strong>Payment ID:</strong> #{order.payment.id}
                </p>
              )}

              <p className="mb-1">
                <strong>Customer:</strong> {order.user?.name}
              </p>

              <p className="mb-3">
                <strong>Email:</strong> {order.user?.email}
              </p>

              {/* Optional Cancel Button */}
              {order.status === "PLACED" && (
                <button className="btn btn-danger w-100">
                  Cancel Order
                </button>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsPage;