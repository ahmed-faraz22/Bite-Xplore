import React, { useState, useEffect, useRef } from "react";
import "../../assets/style/product.css";
import { toast } from "react-toastify";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";

axios.defaults.withCredentials = true;

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [restaurantId, setRestaurantId] = useState("");
  const fileInputRef = useRef(null); // 👈 create ref for file input

  const token = localStorage.getItem("token");

  // Fetch seller restaurant & categories
  useEffect(() => {
    fetchCategories();
    fetchRestaurant();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/categories");
      const data = await res.json();
      setCategories(data.data || []); // ✅ fallback to []
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchRestaurant = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/restaurants/my-restaurant", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurantId(res.data.data?._id || "");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Restaurant not found");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch products");
    }
  };

  // Form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Add or update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId || !form.name || !form.price) {
      toast.error("Category, name, and price are required");
      return;
    }

    const data = new FormData();
    data.append("restaurantId", restaurantId);
    data.append("categoryId", form.categoryId);
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    form.images.forEach((img) => data.append("images", img));

    try {
      if (editingId) {
        const res = await axios.put(
          `http://localhost:4000/api/v1/products/${editingId}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(res.data.message || "Product updated");
      } else {
        const res = await axios.post(
          "http://localhost:4000/api/v1/products",
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(res.data.message || "Product added");
      }

      // 🔥 Reset form
      setForm({ categoryId: "", name: "", description: "", price: "", images: [] });
      setPreviewImages([]);
      setEditingId(null);

      if (fileInputRef.current) fileInputRef.current.value = ""; // 👈 clear file input

      fetchProducts();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    }
  };
  // Edit product
  const handleEdit = (product) => {
    setForm({
      categoryId: product.categoryId?._id || "",
      name: product.name,
      description: product.description,
      price: product.price,
      images: [],
    });
    setPreviewImages(product.images || []);
    setEditingId(product._id);
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await axios.delete(`http://localhost:4000/api/v1/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message || "Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <section className="product">
      <div className="inner">
        <h3>{editingId ? "Edit Product" : "Add Product"}</h3>

        <form onSubmit={handleSubmit} className="product-form">
          <label>Category</label>
          <select name="categoryId" value={form.categoryId} onChange={handleChange}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <label>Product Name</label>
          <input
            name="name"
            type="text"
            placeholder="Enter Product Name"
            value={form.name}
            onChange={handleChange}
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Enter Description"
            value={form.description}
            onChange={handleChange}
          />

          <label>Price</label>
          <input
            name="price"
            type="number"
            placeholder="Enter Price"
            value={form.price}
            onChange={handleChange}
          />

          <label>Images</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef} // 👈 attach ref
          />
          <div className="image-preview" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            {previewImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="preview"
                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }}
              />
            ))}
          </div>

          <button type="submit" className="btn">
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>

        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.description}</td>
                  <td>${p.price}</td>
                  <td>{p.categoryId?.name || "-"}</td>
                  <td>
                    {p.images?.map((img, idx) => (
                      <img key={idx} src={img} alt={p.name} />
                    ))}
                  </td>
                  <td>
                    <FaEdit className="icon edit-icon" onClick={() => handleEdit(p)} />
                    <FaTrash className="icon delete-icon" onClick={() => handleDelete(p._id)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No products added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Product;
