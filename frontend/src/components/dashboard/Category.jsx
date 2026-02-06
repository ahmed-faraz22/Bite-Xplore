import React, { useState, useEffect } from "react";
import "../../assets/style/category.css";
import { toast } from "react-toastify";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";

axios.defaults.withCredentials = true;

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  
  // Get user role from localStorage
  const getUser = () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };
  
  const user = getUser();
  const isAdmin = user?.role === "admin";

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch categories");
    }
  };

  // Add or update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim() || !categoryDescription.trim()) {
      toast.error("Both fields are required");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      if (editingId) {
        // Update
        const res = await axios.put(
          `http://localhost:4000/api/v1/categories/${editingId}`,
          { name: categoryName, description: categoryDescription },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(res.data.message || "Category updated");
      } else {
        // Create
        const res = await axios.post(
          "http://localhost:4000/api/v1/categories",
          { name: categoryName, description: categoryDescription },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(res.data.message || "Category added");
      }
      setCategoryName("");
      setCategoryDescription("");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/v1/categories/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  // Load category into form for editing
  const handleEdit = (category) => {
    setCategoryName(category.name);
    setCategoryDescription(category.description);
    setEditingId(category._id);
  };

  return (
    <section className="category">
      <div className="inner">
        <h3>Categories</h3>
        
        {!isAdmin && (
          <div style={{
            background: "#2a2a2a",
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "20px",
            color: "#fff"
          }}>
            <p style={{ margin: 0, color: "#aaa" }}>
              ⚠️ Only admins can add, edit, or delete categories. You can view all available categories below.
            </p>
          </div>
        )}

        {/* Only show add/edit form for admins */}
        {isAdmin && (
          <form onSubmit={handleSubmit} className="category-form">
            <label htmlFor="categoryName">Category Name</label>
            <input
              id="categoryName"
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />

            <label htmlFor="categoryDescription">Category Description</label>
            <textarea
              id="categoryDescription"
              placeholder="Category Description"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
            />

            <button type="submit" className="btn">
              {editingId ? "Update Category" : "Add Category"}
            </button>
          </form>
        )}

        <table className="category-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat._id}>
                  <td>{cat.name}</td>
                  <td>{cat.description}</td>
                  {isAdmin && (
                    <td>
                      <FaEdit
                        className="icon edit-icon"
                        onClick={() => handleEdit(cat)}
                        style={{ cursor: "pointer" }}
                      />
                      <FaTrash
                        className="icon delete-icon"
                        onClick={() => handleDelete(cat._id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 3 : 2}>No categories added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Category;
