import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    if (!user) {
      return;
    }

    fetch(`${API_URL}/api/jobs`)
      .then((response) => response.json())
      .then((data) => {
        // Logged-in recruiter ki company
        const companyName = user.name.toLowerCase();

        // Sirf apni company ke jobs
        const myJobs = data.filter(
          (job) =>
            job.company.toLowerCase() === companyName
        );

        setJobs(myJobs);
      })
      .catch((error) => {
        console.log("Jobs Error:", error);
      });
  }, []);

  return (
    <div>
      <h1>Recruiter Dashboard</h1>

      {user && (
        <p>
          Welcome, <strong>{user.name}</strong>
        </p>
      )}

      <br />

      <Link to="/post-job">
        <button>
          Post New Job
        </button>
      </Link>

      {" "}

      <Link to="/applicants">
        <button>
          View Applicants
        </button>
      </Link>

      <h2>My Jobs</h2>

      {jobs.length === 0 ? (
        <p>
          No jobs posted by your company.
        </p>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "15px",
              borderRadius: "10px"
            }}
          >
            <h3>{job.title}</h3>

            <p>
              🏢 {job.company}
            </p>

            <p>
              📍 {job.location}
            </p>

            <p>
              💰 {job.salary}
            </p>

            <p>
              {job.description}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default RecruiterDashboard;