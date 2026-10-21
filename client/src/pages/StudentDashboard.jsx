import { useEffect, useState } from "react";
import API_URL from "../api";

function StudentDashboard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`${API_URL}/api/jobs`)
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.log("Jobs Error:", error));
  }, []);

  const handleApply = async (job) => {
    try {
      const response = await fetch(`${API_URL}/api/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentEmail: user.email,
          jobTitle: job.title,
          company: job.company
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Application submitted successfully!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Apply Error:", error);
      alert("Backend se connection nahi ho raha hai.");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      job.title.toLowerCase().includes(searchText) ||
      job.company.toLowerCase().includes(searchText) ||
      job.location.toLowerCase().includes(searchText);

    const matchesLocation =
      location === "" || job.location === location;

    return matchesSearch && matchesLocation;
  });

  const locations = [...new Set(jobs.map((job) => job.location))];

  return (
    <div className="dashboard-page">

      <h1>Student Dashboard</h1>

      {user && (
        <div className="profile-box">
          <h2>Welcome, {user.name} 👋</h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> Student
          </p>
        </div>
      )}

      <div className="job-search">
        <input
          type="text"
          placeholder="Search jobs, company or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">All Locations</option>

          {locations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <h2>Available Jobs</h2>

      {filteredJobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        filteredJobs.map((job) => (
          <div className="job-card" key={job._id}>

            <h2>{job.title}</h2>

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

            <button onClick={() => handleApply(job)}>
              Apply Now
            </button>

          </div>
        ))
      )}

    </div>
  );
}

export default StudentDashboard;