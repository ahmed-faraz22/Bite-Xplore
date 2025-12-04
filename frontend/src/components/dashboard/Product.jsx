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
    isAvailable: true,
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [restaurantId, setRestaurantId] = useState("");
  const [errors, setErrors] = useState({});
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
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate all files are images, not PDFs
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB per file
    const validFiles = [];
    const errors = [];

    files.forEach((file, index) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name} is not an image file. Only JPG, PNG, GIF, WEBP are allowed.`);
      } else if (file.size > maxSize) {
        errors.push(`${file.name} is too large. Maximum size is 5MB.`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      toast.error(errors.join(" "));
      e.target.value = ""; // Clear the input
      setForm({ ...form, images: [] });
      setPreviewImages([]);
      return;
    }

    if (validFiles.length === 0) {
      return;
    }

    setForm({ ...form, images: validFiles });
    setErrors({ ...errors, images: "" }); // Clear image errors

    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.categoryId) {
      newErrors.categoryId = "Please select a category";
    }

    // Product name validation
    if (!form.name || !form.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Product name must be at least 2 characters";
    } else if (form.name.trim().length > 100) {
      newErrors.name = "Product name must be less than 100 characters";
    }

    // Price validation
    if (!form.price || form.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    } else if (isNaN(form.price)) {
      newErrors.price = "Price must be a valid number";
    } else if (parseFloat(form.price) > 100000) {
      newErrors.price = "Price must be less than Rs. 100,000";
    }

    // Description validation
    if (form.description && form.description.trim().length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    // Image validation
    if (!editingId && (!form.images || form.images.length === 0)) {
      newErrors.images = "Please upload at least one image";
    } else if (form.images && form.images.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      form.images.forEach((file, index) => {
        if (!allowedTypes.includes(file.type)) {
          newErrors.images = `Image ${index + 1} is not a valid image file. Only JPG, PNG, GIF, WEBP are allowed. PDF files are not allowed.`;
        } else if (file.size > maxSize) {
          newErrors.images = `Image ${index + 1} is too large. Maximum size is 5MB.`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add or update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const data = new FormData();
    data.append("restaurantId", restaurantId);
    data.append("categoryId", form.categoryId);
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    // Convert checkbox to stock: 1 if available, 0 if not available
    data.append("stock", form.isAvailable ? "1" : "0");
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
      setForm({ categoryId: "", name: "", description: "", price: "", isAvailable: true, images: [] });
      setPreviewImages([]);
      setEditingId(null);
      setErrors({});

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
      isAvailable: product.stock > 0,
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
        <h3>{editingId ? "Edit Menu Item" : "Add Menu Item"}</h3>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Add products to your restaurant menu. These items will appear on your product detail pages.
        </p>

        <form onSubmit={handleSubmit} className="product-form">
          <label>Category *</label>
          <select 
            name="categoryId" 
            value={form.categoryId} 
            onChange={handleChange}
            className={errors.categoryId ? "error-input" : ""}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span className="error-message">{errors.categoryId}</span>}

          <label>Product Name *</label>
          <input
            name="name"
            type="text"
            placeholder="Enter Product Name"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? "error-input" : ""}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Enter Description"
            value={form.description}
            onChange={handleChange}
            className={errors.description ? "error-input" : ""}
            maxLength={500}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
          {form.description && (
            <small style={{ color: "#666" }}>
              {form.description.length}/500 characters
            </small>
          )}

          <label>Price *</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Enter Price"
            value={form.price}
            onChange={handleChange}
            className={errors.price ? "error-input" : ""}
          />
          {errors.price && <span className="error-message">{errors.price}</span>}

          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input
              name="isAvailable"
              type="checkbox"
              checked={form.isAvailable}
              onChange={handleChange}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
            <span>Available</span>
          </label>
          <small style={{ color: "#666", display: "block", marginTop: "5px", marginLeft: "28px" }}>
            Check this box if the item is available for order
          </small>

          <label>Images {!editingId && "*"}</label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            ref={fileInputRef} // 👈 attach ref
            className={errors.images ? "error-input" : ""}
          />
          {errors.images && <span className="error-message">{errors.images}</span>}
          <small style={{ color: "#666", display: "block", marginTop: "5px" }}>
            Upload image files only (JPG, PNG, GIF, WEBP - Max 5MB each). PDF files are not allowed.
          </small>
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
              <th>Availability</th>
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
                  <td>Rs {p.price}</td>
                  <td>
                    <span style={{ 
                      color: p.stock > 0 ? "#4caf50" : "#f44336",
                      fontWeight: "600"
                    }}>
                      {p.stock > 0 ? "✓ Available" : "✗ Not Available"}
                    </span>
                  </td>
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
                <td colSpan="7">No products added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Product;
