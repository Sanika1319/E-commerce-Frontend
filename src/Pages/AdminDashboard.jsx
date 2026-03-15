import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CategoryService from "../services/categoryService";
import productService from "../services/productService";
import orderService from "../services/orderService";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [category, setCategory] = useState({
    categoryName: "",
    description: "",
    status: true,
  });

  const [showDeactivate, setShowDeactivate] = useState(false);
  const [oldCategory, setOldCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    quantity: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadCategories();
  }, []);

  // Load Products
  const loadProducts = async () => {
    const data = await productService.getAllProducts();
    setProducts(data);
  };

  // Load Orders
  const loadOrders = async () => {
    const data = await orderService.getAllOrders();
    setOrders(data);
  };

  // Load Categories
  const loadCategories = async () => {
    const data = await CategoryService.getAllCategories();
    console.log("Categories:", data);
    setCategories(data);
  };

  // Product change
  const handleProductChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Category change
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;

    setCategory({
      ...category,
      [name]: name === "status" ? value === "true" : value,
    });
  };

  // activate category
  const activateCategory = async (id) => {
    await CategoryService.activateCategory(id);
    alert("Category activated");
    loadCategories();
  };

  // Create Category
  const createCategory = async () => {
    try {
      if (!category.categoryName) {
        alert("Category name required");
        return;
      }

      await CategoryService.createCategory(category);

      // alert("Category created successfully");
      Swal.fire({
  icon: "success",
  title: "Success",
  text: "Category created successfully",
});

      setCategory({
        categoryName: "",
        description: "",
        status: true,
      });

      loadCategories();
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        alert("Unauthorized. Please login as ADMIN.");
      } else {
        alert("Server error while creating category");
      }
    }
  };

  // deactivate category
  const deactivateCategory = async () => {
    if (!oldCategory || !newCategory) {
      alert("Select both categories");
      return;
    }

    if (oldCategory === newCategory) {
      alert("Old and New category cannot be same");
      return;
    }

    await CategoryService.deactivateCategory(oldCategory, newCategory);

    alert("Category deactivated and products moved");

    setOldCategory("");
    setNewCategory("");
    setShowDeactivate(false);

    loadCategories();
    loadProducts();
  };

  // Add Product
  const addProduct = async () => {
    try {
      if (!selectedCategory) {
        alert("Select category");
        return;
      }

      const newProduct = {
        ...product,
        price: Number(product.price),
        quantity: Number(product.quantity),
      };

      await productService.createProduct(selectedCategory, newProduct);

      setProduct({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        quantity: "",
      });

      setSelectedCategory("");

      loadProducts();
    } catch (error) {
      console.error(error);
    }
  };
  // Delete Product
  // const deleteProduct = async (id) => {
  //   await productService.deleteProduct(id);
  //   loadProducts();
  // };
  const deleteProduct = async (id) => {

  const result = await Swal.fire({
    title: "Delete Product?",
    text: "This product will be deleted permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes Delete",
  });

  if (result.isConfirmed) {
    await productService.deleteProduct(id);
    loadProducts();

    Swal.fire("Deleted!", "Product deleted successfully", "success");
  }

};

  // Edit Product
 const handleEdit = (p) => {
  setEditingId(p.id);

  setProduct({
    name: p.name,
    description: p.description,
    price: p.price,
    imageUrl: p.imageUrl,
    quantity: p.quantity,
  });

  setSelectedCategory(p.category ? p.category.id : "");
};

  // Update Product
  const updateProduct = async () => {
  try {
    const updatedProduct = {
      ...product,
      price: Number(product.price),
      quantity: Number(product.quantity),
    };

    await productService.updateProduct(editingId, updatedProduct);

    setEditingId(null);

    setProduct({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      quantity: "",
    });

    setSelectedCategory("");

    loadProducts();
  } catch (error) {
    console.error(error);
    alert("Error updating product");
  }
};

  return (
    <div className="container-fluid">
      <div className="container mt-4">
        <h2 className="text-center fw-bold mb-4">Admin Dashboard</h2>

        {/* DASHBOARD STATS */}

        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card text-center shadow">
              <div className="card-body">
                <h5>Total Products</h5>
                <h3>{products.length}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-center shadow">
              <div className="card-body">
                <h5>Total Orders</h5>
                <h3>{orders.length}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-center shadow">
              <div className="card-body">
                <h5>Total Categories</h5>
                <h3>{categories.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY FORM */}

        <div className="card shadow mb-4">
          <div className="card-header bg-secondary text-white fw-bold">
            Create Category
          </div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <input
                  type="text"
                  name="categoryName"
                  className="form-control"
                  placeholder="Category Name"
                  value={category.categoryName}
                  onChange={handleCategoryChange}
                />
              </div>

              <div className="col-md-4">
                <input
                  type="text"
                  name="description"
                  className="form-control"
                  placeholder="Description"
                  value={category.description}
                  onChange={handleCategoryChange}
                />
              </div>

              <div className="col-md-3">
                <select
                  name="status"
                  className="form-control"
                  value={category.status}
                  onChange={handleCategoryChange}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Deactive</option>
                </select>
              </div>

              <div className="col-md-2 d-grid">
                <button className="btn btn-success" onClick={createCategory}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY TABLE */}

        <div className="card shadow mb-4">
          <div className="card-header bg-dark text-white fw-bold">
            All Categories
          </div>

          <div className="card-body">
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((c) => (
                  <tr key={c.categoryId}>
                    <td>{c.categoryName}</td>
                    <td>{c.description}</td>

                    <td>
                      {c.status ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-danger">Inactive</span>
                      )}
                    </td>

                    <td>
                      {c.status ? (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            setShowDeactivate(true);
                            setOldCategory("");
                            setNewCategory("");
                          }}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => activateCategory(c.categoryId)}
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showDeactivate && (
              <div className="card shadow mb-4">
                <div className="card-header bg-danger text-white">
                  Deactivate Category
                </div>

                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-5">
                      <label className="form-label">Old Category</label>

                      <select
                        className="form-control"
                        value={oldCategory}
                        onChange={(e) => setOldCategory(e.target.value)}
                      >
                        <option value="">Select Old Category</option>

                        {categories
                          .filter((c) => c.status)
                          .map((c) => (
                            <option key={c.categoryId} value={c.categoryId}>
                              {c.categoryName}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="col-md-5">
                      <label className="form-label">Move Products To</label>

                      <select
                        className="form-control"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      >
                        <option value="">Select New Category</option>

                        {categories
                          .filter((c) => c.status)
                          .map((c) => (
                            <option key={c.categoryId} value={c.categoryId}>
                              {c.categoryName}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="col-md-2 d-grid align-items-end">
                      <button
                        className="btn btn-danger"
                        onClick={deactivateCategory}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PRODUCT FORM */}

        <div className="card shadow mb-4">
          <div className="card-header bg-primary text-white fw-bold">
            {editingId ? "Update Product" : "Add Product"}
          </div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <select
                  className="form-control"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select Category</option>

                  {categories
                    .filter((c) => c.status)
                    .map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.categoryName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-md-3">
                <input
                  className="form-control"
                  placeholder="Name"
                  name="name"
                  value={product.name}
                  onChange={handleProductChange}
                />
              </div>

              <div className="col-md-2">
                <input
                  className="form-control"
                  placeholder="Price"
                  name="price"
                  value={product.price}
                  onChange={handleProductChange}
                />
              </div>

              <div className="col-md-2">
                <input
                  className="form-control"
                  placeholder="Quantity"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleProductChange}
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Description"
                  name="description"
                  value={product.description}
                  onChange={handleProductChange}
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Image URL"
                  name="imageUrl"
                  value={product.imageUrl}
                  onChange={handleProductChange}
                />
              </div>

              <div className="col-md-12 text-end">
                {editingId ? (
                  <button className="btn btn-warning" onClick={updateProduct}>
                    Update Product
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={addProduct}>
                    Add Product
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCTS TABLE */}

        <div className="card shadow mb-4">
          <div className="card-header bg-dark text-white fw-bold">
            All Products
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>

                    <td>
                      <span className="badge bg-info">{p.category?.name}</span>
                    </td>

                    <td>₹{p.price}</td>

                    <td>{p.quantity}</td>

                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteProduct(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ORDERS TABLE */}

        <div className="card shadow">
          <div className="card-header bg-success text-white fw-bold">
            All Orders
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.user?.name}</td>
                    <td>₹{o.totalAmount}</td>

                    <td>
                      <span className="badge bg-success">{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
