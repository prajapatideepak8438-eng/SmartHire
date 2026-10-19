import { useEffect, useState } from "react";

function StudentDashboard() {

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // ================= FETCH JOBS =================

  useEffect(() => {

    fetch("http://localhost:5000/api/jobs")

      .then((response) => response.json())

      .then((data) => {

        console.log("Jobs:", data);

        setJobs(data);

      })

      .catch((error) => {

        console.log("Jobs Error:", error);

      });

  }, []);


  // ================= APPLY JOB =================

  const handleApply = async (job) => {

    alert("Applying for " + job.title);


    if (!user) {

      alert("Please login first!");

      return;

    }


    try {

      const response = await fetch(
        "http://localhost:5000/api/apply",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            studentEmail: user.email,

            jobTitle: job.title,

            company: job.company

          })

        }
      );


      const data = await response.json();


      if (response.ok) {

        alert(
          "Application submitted successfully!"
        );

      } else {

        alert(
          data.message || "Application failed"
        );

      }


    } catch (error) {

      console.log(
        "Application Error:",
        error
      );

      alert(
        "Backend se connection nahi ho raha hai. Check karo ki server running hai."
      );

    }

  };


  // ================= GET LOCATIONS =================

  const locations = [
    "All",
    ...new Set(
      jobs.map((job) => job.location)
    )
  ];


  // ================= FILTER JOBS =================

  const filteredJobs = jobs.filter((job) => {

    const searchText = search.toLowerCase();

    const matchesSearch =
      job.title.toLowerCase().includes(searchText) ||
      job.company.toLowerCase().includes(searchText) ||
      job.location.toLowerCase().includes(searchText);

    const matchesLocation =
      location === "All" ||
      job.location === location;

    return matchesSearch && matchesLocation;

  });


  // ================= UI =================

  return (

    <div>

      <h1>Student Dashboard</h1>


      {/* ================= STUDENT PROFILE ================= */}

      {user && (

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "30px",
            borderRadius: "10px",
            background: "#f8fafc"
          }}
        >

          <h2>👤 My Profile</h2>

          <p>
            <strong>Name:</strong> {user.name}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Role:</strong> {user.role}
          </p>

        </div>

      )}


      {user && (

        <p>
          Welcome, <strong>{user.name}</strong>
        </p>

      )}


      {/* ================= SEARCH ================= */}

      <h2>Available Jobs</h2>

      <input
        type="text"
        placeholder="🔍 Search job, company or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "90%",
          maxWidth: "500px",
          padding: "12px",
          marginBottom: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          fontSize: "16px"
        }}
      />


      {/* ================= LOCATION FILTER ================= */}

      <br />

      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{
          padding: "12px",
          marginBottom: "25px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          fontSize: "16px"
        }}
      >

        {locations.map((item) => (

          <option
            key={item}
            value={item}
          >
            {item === "All"
              ? "📍 All Locations"
              : `📍 ${item}`}
          </option>

        ))}

      </select>


      {/* ================= JOB LIST ================= */}

      {filteredJobs.length === 0 ? (

        <p>
          No jobs found.
        </p>

      ) : (

        filteredJobs.map((job) => (

          <div
            key={job._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "10px"
            }}
          >

            <h3>
              {job.title}
            </h3>


            <p>
              🏢 <strong>{job.company}</strong>
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


            <button
              type="button"
              onClick={() => handleApply(job)}
            >
              Apply Now
            </button>

          </div>

        ))

      )}

    </div>

  );

}


export default StudentDashboard;