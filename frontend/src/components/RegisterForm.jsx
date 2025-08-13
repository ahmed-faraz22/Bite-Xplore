import { useState } from "react";
import Button from "./Button";
import { registerUser } from "../../api/auth"; 
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/; 

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!phoneRegex.test(form.phone))
      newErrors.phone = "Invalid phone number";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await registerUser(form);
      toast.success("Registered successfully!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form>
      <h2>Register</h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        type="text"
        placeholder="Name"
        className={errors.name ? "error" : ""}
      />
      {errors.name && <p className="error-msg">{errors.name}</p>}

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        type="email"
        placeholder="Email"
        className={errors.email ? "error" : ""}
      />
      {errors.email && <p className="error-msg">{errors.email}</p>}

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        type="tel"
        placeholder="Phone Number"
        className={errors.phone ? "error" : ""}
      />
      {errors.phone && <p className="error-msg">{errors.phone}</p>}

      <input
        name="password"
        value={form.password}
        onChange={handleChange}
        type="password"
        placeholder="Password"
        className={errors.password ? "error" : ""}
      />
      {errors.password && <p className="error-msg">{errors.password}</p>}

      <Button type="submit" onClick={handleRegister} className="authButton" buttonText="Register" />
      <ToastContainer />
    </form>
  );
}

export default RegisterForm;
