import { useEffect, useState } from "react";
import API_URL from "../api";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/jobs`)
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  return (
    <div className="jobs-page">
      <h1>Available Jobs</h1>

      {jobs.map((job, index) => (
        <div className="job-card" key={index}>
          <h2>{job.title}</h2>
          <p>🏢 {job.company}</p>
          <p>📍 {job.location}</p>
          <p>💰 {job.salary}</p>
          <p>{job.description}</p>

          <button>Apply Now</button>
        </div>
      ))}
    </div>
  );
}

export default Jobs;