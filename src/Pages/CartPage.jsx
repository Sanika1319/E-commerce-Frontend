import { useEffect, useState } from "react";
import CartService from "../services/cartService";
import { useNavigate } from "react-router-dom";
import { getUserId, isLoggedIn } from "../services/AuthHelper";
import { useCart } from "../context/CartContext";
import PaymentService from "../services/PaymentService";

const CartPage = () => {
  const navigate = useNavigate();
  const { loadCart } = useCart();
  const userId = getUserId();

  const [cart, setCart] = useState({
    cartItems: [],
    totalAmount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false); // ✅ FIXED

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await CartService.getCart(userId);
      const data = res.data;

      setCart({
        cartItems: Array.isArray(data.cartItems) ? data.cartItems : [],
        totalAmount: data.totalAmount || 0,
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await fetchCart();
    if (loadCart) await loadCart();
  };

  const increaseQty = async (productId) => {
    try {
      await CartService.addToCart(userId, productId, 1);
      await refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const decreaseQty = async (productId) => {
    try {
      await CartService.addToCart(userId, productId, -1);
      await refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await CartService.removeFromCart(userId, productId);
      await refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      await CartService.clearCart(userId);
      await refresh();
    } catch (err) {
      console.error(err);
    }
  };

// 🔥 RAZORPAY CHECKOUT (FINAL VERSION)
const handleCheckout = async () => {
  try {
    setProcessing(true);

    // 🔥 STEP 1: CREATE ORDER FROM BACKEND
    const res = await PaymentService.createOrder(userId);

    console.log("CREATE ORDER RESPONSE:", res.data);

    // ✅ IMPORTANT: Use correct key from backend
    const razorpayOrderId = res.data.razorpayOrderId || res.data.orderId;

    const amount = res.data.amount;
    const key = res.data.key;

    // ❌ STOP if orderId missing
    if (!razorpayOrderId) {
      alert("Order creation failed ❌");
      setProcessing(false);
      return;
    }

    console.log("Razorpay Order ID:", razorpayOrderId);

    // 🔥 STEP 2: CONFIGURE RAZORPAY
    const options = {
      key: key,
      amount: amount,
      currency: "INR",
      name: "SmartBite",
      description: "Order Payment",
      order_id: razorpayOrderId,

      // ✅ SUCCESS HANDLER
      handler: async function (response) {
        try {
          console.log("RAZORPAY RESPONSE:", response);

          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          // ❌ VALIDATION (VERY IMPORTANT)
          if (
            !paymentData.razorpay_order_id ||
            !paymentData.razorpay_payment_id ||
            !paymentData.razorpay_signature
          ) {
            console.error("Invalid payment response:", paymentData);
            alert("Payment data incomplete ❌");
            return;
          }

          console.log("Sending to backend:", paymentData);

          // 🔥 STEP 3: VERIFY PAYMENT
          await PaymentService.verifyPayment(userId, paymentData);

          alert("Payment Successful 🎉");

          // 🔥 STEP 4: CLEAR CART + REFRESH
          await CartService.clearCart(userId);
          await refresh();

          navigate("/orders");
        } catch (error) {
          console.error("Verification failed:", error);
          alert("Payment verification failed ❌");
        }
      },

      // ❌ PAYMENT FAILED / CLOSED
      modal: {
        ondismiss: function () {
          console.log("Payment popup closed");
          setProcessing(false);
        },
      },

      // 🎨 UI
      theme: {
        color: "#ffc107",
      },
    };

    // 🔥 STEP 5: OPEN RAZORPAY
    const razorpay = new window.Razorpay(options);
    razorpay.open();

  } catch (err) {
    console.error("Payment failed:", err);
    alert("Unable to start payment ❌");
    setProcessing(false);
  }
};

  if (loading) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;

  if (!cart.cartItems.length)
    return (
      <div style={emptyPage}>
        <h2>Your cart is empty 🛒</h2>
        <button style={continueBtn} onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );

  return (
    <div style={page}>
      <div style={layout}>
        {/* LEFT SECTION */}
        <div style={leftSection}>
          <h2 style={title}>Shopping Cart</h2>

          {cart.cartItems.map((item) => {
            const product = item.product;
            const subtotal = product.price * item.quantity;

            return (
              <div key={product.id} style={card}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={productImage}
                />

                <div style={info}>
                  <h3 style={productName}>{product.name}</h3>
                  <p style={productDesc}>{product.description}</p>

                  <div style={priceRow}>
                    <span style={price}>₹{product.price}</span>
                    <span>Subtotal: ₹{subtotal}</span>
                  </div>

                  <div style={quantityBox}>
                    <button
                      onClick={() => decreaseQty(product.id)}
                      style={qtyButton}
                    >
                      −
                    </button>

                    <span style={qtyText}>{item.quantity}</span>

                    <button
                      onClick={() => increaseQty(product.id)}
                      style={qtyButton}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(product.id)}
                    style={removeBtn}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT SECTION */}
        <div style={rightSection}>
          <h3>Order Summary</h3>

          <div style={summaryRow}>
            <span>Subtotal</span>
            <span>₹{cart.totalAmount}</span>
          </div>

          <div style={summaryRow}>
            <strong>Total</strong>
            <strong style={grandTotal}>₹{cart.totalAmount}</strong>
          </div>

          <button
            onClick={handleCheckout}
            disabled={processing}
            style={{
              ...checkoutBtn,
              opacity: processing ? 0.6 : 1,
              cursor: processing ? "not-allowed" : "pointer",
            }}
          >
            {processing ? "Processing..." : "Proceed to Checkout"}
          </button>

          <button onClick={clearCart} style={clearBtn}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const page = {
  backgroundColor: "#f3f3f3",
  minHeight: "100vh",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
};

const layout = {
  maxWidth: "1200px",
  margin: "auto",
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
};

const leftSection = {
  flex: "2 1 600px",
};

const rightSection = {
  flex: "1 1 300px",
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  height: "fit-content",
};

const title = { marginBottom: "20px" };

const card = {
  display: "flex",
  gap: "15px",
  background: "#fff",
  padding: "15px",
  borderRadius: "8px",
  marginBottom: "15px",
};

const productImage = {
  width: "120px",
  height: "120px",
  objectFit: "cover",
};

const info = { flex: 1 };

const productName = { fontWeight: "600" };

const productDesc = { fontSize: "14px", color: "#555" };

const priceRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "10px",
};

const price = { fontWeight: "600" };

const quantityBox = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginTop: "10px",
};

const qtyButton = {
  padding: "5px 10px",
  border: "1px solid #ccc",
  background: "#f0f0f0",
  cursor: "pointer",
};

const qtyText = { fontWeight: "600" };

const removeBtn = {
  marginTop: "8px",
  border: "none",
  background: "none",
  color: "#d32f2f",
  cursor: "pointer",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
};

const grandTotal = { fontSize: "18px" };

const checkoutBtn = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  background: "#ff9900",
  border: "none",
  fontWeight: "600",
};

const clearBtn = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  border: "1px solid #d32f2f",
  background: "transparent",
  color: "#d32f2f",
  cursor: "pointer",
};

const emptyPage = {
  textAlign: "center",
  marginTop: "100px",
};

const continueBtn = {
  padding: "10px 20px",
  marginTop: "15px",
  background: "#ff9900",
  border: "none",
  cursor: "pointer",
};

export default CartPage;
