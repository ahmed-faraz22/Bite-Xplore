// import { useState } from "react";
// import Button from "../components/Button";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../../api/auth";
// import { toast, ToastContainer } from "react-toastify";

// function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const validate = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!emailRegex.test(email)) {
//       newErrors.email = "Invalid email format";
//     }

//     if (!password) {
//       newErrors.password = "Password is required";
//     } else if (password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       const data = await loginUser({email, password});
//       localStorage.setItem("token", data.token);
//       window.dispatchEvent(new Event("storage"));
//       toast.success("Login Successful!");
//       setTimeout(() => navigate("/"), 1000);
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <form>
//       <h2>Login</h2>

//       <input
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         type="email"
//         placeholder="Email"
//         className={errors.email ? "error" : ""}
//       />
//       {errors.email && <p className="error-msg">{errors.email}</p>}

//       <input
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         type="password"
//         placeholder="Password"
//         className={errors.password ? "error" : ""}
//       />
//       {errors.password && <p className="error-msg">{errors.password}</p>}

//       <Button onClick={handleLogin} className="authButton" buttonText="Login" />
//       <ToastContainer />
//     </form>
//   );
// }

// export default LoginForm;
import React, { useState } from "react";
import Button from "../components/Button";

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Login Data:", { email, password });
      // submit logic here
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <div className="social-container">
          <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
          <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
        </div>
        <span>or use your account</span>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}

        <a href="#" className="resetpass">Forgot your password?</a>
        <Button type="submit" className="authButton" buttonText="Login" />
      </form>
    </div>
  );
}
