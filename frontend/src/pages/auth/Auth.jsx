import { useState } from "react";
import "../../assets/style/Auth.css";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  return (
    <section className="auth">
      <div className="container">
        <div className="tabs">
          <button
            className={activeTab === "login" ? "tab active" : "tab"}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={activeTab === "register" ? "tab active" : "tab"}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        <div className="form-container">
          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </section>
  );
};

export default Auth;
