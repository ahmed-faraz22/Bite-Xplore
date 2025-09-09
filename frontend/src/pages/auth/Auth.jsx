// import { useState } from "react";
// import "../../assets/style/Auth.css";
// import LoginForm from "../../components/LoginForm";
// import RegisterForm from "../../components/RegisterForm";

// const Auth = () => {
//   const [activeTab, setActiveTab] = useState("login");
//   return (
//     <section className="auth">
//       <div className="container">
//         <div className="tabs">
//           <button
//             className={activeTab === "login" ? "tab active" : "tab"}
//             onClick={() => setActiveTab("login")}
//           >
//             Login
//           </button>
//           <button
//             className={activeTab === "register" ? "tab active" : "tab"}
//             onClick={() => setActiveTab("register")}
//           >
//             Register
//           </button>
//         </div>

//         <div className="form-container">
//           {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Auth;
import React, { useState } from "react";
import "../../assets/style/Auth.css";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";
import Button from "../../components/Button";

export default function AuthForm() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  return (
    <section className="auth">
      <div className="container">
        <div className="inner">
          <div className={`form-wrapper ${isRightPanelActive ? "right-panel-active" : ""}`}>
            <RegisterForm />
            <LoginForm />
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <h1>Welcome Back!</h1>
                  <p>To keep connected with us please login with your personal info</p>
                  <Button onClick={() => setIsRightPanelActive(false)} className="ghost" buttonText="Sign In" />
                </div>
                <div className="overlay-panel overlay-right">
                  <h1>Hello, Friend!</h1>
                  <p>Enter your personal details and start journey with us</p>
                  <Button onClick={() => setIsRightPanelActive(true)} className="ghost" buttonText="Sign Up" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
