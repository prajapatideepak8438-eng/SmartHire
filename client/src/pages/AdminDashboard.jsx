import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import API_URL from "../api";

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`${API_URL}/api/students`)
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.log("Students Error:", error));

    fetch(`${API_URL}/api/recruiters`)
      .then((response) => response.json())
      .then((data) => setRecruiters(data))
      .catch((error) => console.log("Recruiters Error:", error));

    fetch(`${API_URL}/api/jobs`)
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.log("Jobs Error:", error));

    fetch(`${API_URL}/api/applications`)
      .then((response) => response.json())
      .then((data) => setApplications(data))
      .catch((error) => console.log("Applications Error:", error));
  }, []);

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-page">

      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>SmartHire Placement Management System</p>
      </div>

      <div className="stats-container">

        <div className="stat-card">
          <div className="stat-icon">👨‍🎓</div>
          <h3>Total Students</h3>
          <p>{students.length}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <h3>Total Recruiters</h3>
          <p>{recruiters.length}</p>
        </div>

        <div
          className="stat-card"
          onClick={() => navigate("/jobs")}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-icon">💼</div>
          <h3>Total Jobs</h3>
          <p>{jobs.length}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <h3>Total Applications</h3>
          <p>{applications.length}</p>
        </div>

      </div>

      <div className="admin-section">
        <h2>👨‍🎓 Manage Students</h2>

        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          students.map((student) => (
            <div className="admin-item" key={student._id}>
              <p>
                <strong>Name:</strong> {student.name}
              </p>
              <p>
                <strong>Email:</strong> {student.email}
              </p>
              <p>
                <strong>Role:</strong> {student.role}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="admin-section">
        <h2>🏢 Manage Recruiters</h2>

        {recruiters.length === 0 ? (
          <p>No recruiters found.</p>
        ) : (
          recruiters.map((recruiter) => (
            <div className="admin-item" key={recruiter._id}>
              <p>
                <strong>Company:</strong> {recruiter.name}
              </p>
              <p>
                <strong>Email:</strong> {recruiter.email}
              </p>
              <p>
                <strong>Role:</strong> {recruiter.role}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="admin-section">
        <h2>💼 Manage Jobs</h2>

        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          jobs.map((job) => (
            <div className="admin-item" key={job._id}>
              <h3>{job.title}</h3>
              <p>
                <strong>Company:</strong> {job.company}
              </p>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Salary:</strong> {job.salary}
              </p>
              <p>
                <strong>Description:</strong> {job.description}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="admin-section">
        <h2>📋 Manage Applications</h2>

        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          applications.map((application) => (
            <div className="admin-item" key={application._id}>
              <p>
                <strong>Student:</strong> {application.studentEmail}
              </p>
              <p>
                <strong>Job:</strong> {application.jobTitle}
              </p>
              <p>
                <strong>Company:</strong> {application.company}
              </p>
              <p>
                <strong>Status:</strong> {application.status}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default AdminDashboard;