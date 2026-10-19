import StudentDashboard from "./pages/StudentDashboard";
import MyApplications from "./pages/MyApplications";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";
import Applicants from "./pages/Applicants";
import AdminDashboard from "./pages/AdminDashboard";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from "react-router-dom";

import "./App.css";

import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Register from "./pages/Register";


// ================= HOME =================

function Home() {
  return (
    <main>
      <h1>Welcome to SmartHire</h1>

      <p>
        Job Portal & Placement Management System
      </p>

      <Link to="/jobs">
        <button>View Jobs</button>
      </Link>
    </main>
  );
}


// ================= PROTECTED ROUTE =================

function ProtectedRoute({ children, allowedRole }) {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // User login nahi hai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User ka role allowed nahi hai
  if (user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}


// ================= NAVIGATION =================

function Navigation() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  const handleLogout = () => {

    localStorage.removeItem("user");

    alert("Logout successful!");

    navigate("/login");

  };


  return (
    <nav>

      <h2>SmartHire</h2>

      <div>

        <Link to="/">
          Home
        </Link>

        <Link to="/jobs">
          Jobs
        </Link>


        {/* Student Links */}

        {user && user.role === "student" && (
          <>
            <Link to="/student-dashboard">
              Student Dashboard
            </Link>

            <Link to="/my-applications">
              My Applications
            </Link>
          </>
        )}


        {/* Recruiter Links */}

        {user && user.role === "recruiter" && (
          <>
            <Link to="/recruiter-dashboard">
              Recruiter Dashboard
            </Link>

            <Link to="/post-job">
              Post Job
            </Link>

            <Link to="/applicants">
              Applicants
            </Link>
          </>
        )}


        {/* Admin Links */}

        {user && user.role === "admin" && (
          <Link to="/admin-dashboard">
            Admin Dashboard
          </Link>
        )}


        {/* Login/Register */}

        {!user && (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}


        {/* Logout */}

        {user && (
          <button onClick={handleLogout}>
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}


// ================= APP =================

function App() {

  return (
    <BrowserRouter>

      <div>

        <Navigation />

        <Routes>


          {/* Home */}

          <Route
            path="/"
            element={<Home />}
          />


          {/* Jobs */}

          <Route
            path="/jobs"
            element={<Jobs />}
          />


          {/* Login */}

          <Route
            path="/login"
            element={<Login />}
          />


          {/* Register */}

          <Route
            path="/register"
            element={<Register />}
          />


          {/* ================= STUDENT ================= */}

          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-applications"
            element={
              <ProtectedRoute allowedRole="student">
                <MyApplications />
              </ProtectedRoute>
            }
          />


          {/* ================= RECRUITER ================= */}

          <Route
            path="/recruiter-dashboard"
            element={
              <ProtectedRoute allowedRole="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/post-job"
            element={
              <ProtectedRoute allowedRole="recruiter">
                <PostJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/applicants"
            element={
              <ProtectedRoute allowedRole="recruiter">
                <Applicants />
              </ProtectedRoute>
            }
          />


          {/* ================= ADMIN ================= */}

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;