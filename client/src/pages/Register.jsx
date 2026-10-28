import { useState } from "react";
import API_URL from "../api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleRegister = async () => {
    console.log("Register function called");

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role
        })
      });

      const data = await response.json();

      console.log("Backend Response:", data);

      if (response.ok) {
        alert("Registration successful!");

        setName("");
        setEmail("");
        setPassword("");
        setRole("");
      } else {
        alert(
          "Registration failed!\n\n" +
          "Message: " +
          (data.message || "Unknown error") +
          "\n\nError: " +
          (data.error || "No error details")
        );
      }
    } catch (error) {
      console.log("Error:", error);

      alert(
        "Registration failed!\n\n" +
        "Error: " +
        error.message
      );
    }
  };

  return (
    <div className="register-page">
      <h1>Create Account</h1>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

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
        placeholder="Create password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">Select Role</option>
        <option value="student">Student</option>
        <option value="recruiter">Recruiter</option>
        <option value="admin">Admin</option>
      </select>

      <br />
      <br />

      <button onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}

export default Register;