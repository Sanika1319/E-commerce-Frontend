import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderService from "../services/OrderService";
import UserService from "../services/userService";
import AddressService from "../services/AddressService";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    addresses: [],
  });

  // ================= LOAD USER =================
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await UserService.getCurrentUser();
      setUser(userData);

      const addressData = await AddressService.getAddressesByUser(userData.id);

      setFormData({
        addresses: addressData.map((addr) => ({
          addressId: addr.id,
          street: addr.street || "",
          city: addr.city || "",
          state: addr.state || "",
          pincode: addr.pincode || "",
          type: addr.type || "",
        })),
      });

      loadOrders(userData.id);
    } catch (err) {
      console.error(err);
    }
  };

  const loadOrders = async (userId) => {
    try {
      const data = await OrderService.getOrdersByUser(userId);
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ADDRESS FUNCTIONS =================
  const handleAddressChange = (idx, field, value) => {
    const updated = [...formData.addresses];
    updated[idx][field] = value;
    setFormData({ ...formData, addresses: updated });
  };

  const handleAddAddress = () => {
    setFormData({
      ...formData,
      addresses: [
        ...formData.addresses,
        {
          addressId: null,
          street: "",
          city: "",
          state: "",
          pincode: "",
          type: "",
        },
      ],
    });
  };

  const handleDeleteAddress = async (idx) => {
    const addressId = formData.addresses[idx].addressId;

    if (addressId) {
      try {
        await AddressService.deleteAddress(addressId);
      } catch (err) {
        console.error(err);
        return;
      }
    }

    const updated = formData.addresses.filter((_, i) => i !== idx);
    setFormData({ ...formData, addresses: updated });
  };

  const handleSaveAddresses = async () => {
    try {
      for (let addr of formData.addresses) {
        if (!addr.street || !addr.city || !addr.state || !addr.pincode) {
          alert("Please fill all address fields");
          return;
        }

        if (addr.addressId) {
          await AddressService.updateAddress(user.id, addr.addressId, addr);
        } else {
          await AddressService.addAddress(user.id, addr);
        }
      }

      alert("Addresses saved successfully ✅");
      loadUser();
    } catch (error) {
      console.error(error);
      alert("Failed to save addresses ❌");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <h4>Please login to view profile</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row g-4">

        {/* LEFT PROFILE */}
        <div className="col-lg-4">
          <div className="card shadow-lg border-0 text-center p-4">
            <img
              src={`https://ui-avatars.com/api/?name=${user.name}&background=000&color=fff&size=150`}
              alt="Profile"
              className="rounded-circle shadow mb-3"
              width="120"
              height="120"
            />

            <h4 className="fw-bold">{user.name}</h4>
            <p className="text-muted">{user.email}</p>

            <div className="badge bg-dark mb-3">{user.role}</div>

            <button
              className="btn btn-outline-dark w-100 mb-2"
              onClick={() => navigate("/orders")}
            >
              View My Orders
            </button>

            <button className="btn btn-danger w-100" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-8">

          {/* ACCOUNT INFO */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Account Information</h5>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="text-muted">Full Name</label>
                  <input className="form-control" value={user.name} readOnly />
                </div>

                <div className="col-md-6">
                  <label className="text-muted">Email</label>
                  <input className="form-control" value={user.email} readOnly />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label className="text-muted">Member Since</label>
                  <input
                    className="form-control"
                    value={
                      user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-IN")
                        : ""
                    }
                    readOnly
                  />
                </div>

                <div className="col-md-6">
                  <label className="text-muted">Total Orders</label>
                  <input className="form-control" value={orders.length} readOnly />
                </div>
              </div>
            </div>
          </div>

          {/* ADDRESS SECTION */}
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">My Addresses</h5>

              {formData.addresses.map((addr, idx) => (
                <div key={idx} className="border rounded p-3 mb-3">

                  <div className="row g-2">

                    <div className="col-md-6">
                      <input
                        className="form-control"
                        placeholder="Street"
                        value={addr.street}
                        onChange={(e) =>
                          handleAddressChange(idx, "street", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        className="form-control"
                        placeholder="City"
                        value={addr.city}
                        onChange={(e) =>
                          handleAddressChange(idx, "city", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <input
                        className="form-control"
                        placeholder="State"
                        value={addr.state}
                        onChange={(e) =>
                          handleAddressChange(idx, "state", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <input
                        className="form-control"
                        placeholder="Pincode"
                        value={addr.pincode}
                        onChange={(e) =>
                          handleAddressChange(idx, "pincode", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <select
                        className="form-select"
                        value={addr.type}
                        onChange={(e) =>
                          handleAddressChange(idx, "type", e.target.value)
                        }
                      >
                        <option value="">Select Type</option>
                        <option value="HOME">Home</option>
                        <option value="WORK">Work</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  <button
                    className="btn btn-danger mt-3"
                    onClick={() => handleDeleteAddress(idx)}
                  >
                    Delete Address
                  </button>

                </div>
              ))}

              <button
                className="btn btn-outline-primary"
                onClick={handleAddAddress}
              >
                + Add New Address
              </button>

              <button
                className="btn btn-success w-100 mt-3"
                onClick={handleSaveAddresses}
              >
                Save Addresses
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;