import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    console.log("LOGIN BUTTON CLICKED");
    console.log("Email:", email);
    console.log("Password:", password);

    try {

      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password
          })
        }
      );

      console.log("Response Status:", response.status);

      const data = await response.json();

      console.log("Login Response:", data);

      if (response.ok) {

        alert("Login successful!");

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        if (data.user.role === "student") {

          navigate("/student-dashboard");

        } else if (data.user.role === "recruiter") {

          navigate("/recruiter-dashboard");

        } else if (data.user.role === "admin") {

          navigate("/admin-dashboard");

        }

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.log("Login Error:", error);

      alert(
        "Backend se connection nahi ho raha hai."
      );

    }
  };

  return (
    <div className="login-page">

      <h1>Welcome Back</h1>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleLogin}>
        Login
      </button>

    </div>
  );
}

export default Login;