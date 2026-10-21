import { useEffect, useState } from "react";
import API_URL from "../api";

function Applicants() {
  const [applications, setApplications] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`${API_URL}/api/applications`)
      .then((response) => response.json())
      .then((data) => {
        if (!user) {
          setApplications([]);
          return;
        }

        const myApplications = data.filter(
          (application) =>
            application.company.toLowerCase() ===
            user.name.toLowerCase()
        );

        setApplications(myApplications);
      })
      .catch((error) =>
        console.log("Applications Error:", error)
      );
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${API_URL}/api/applications/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(`Application ${status}!`);

        setApplications((oldApplications) =>
          oldApplications.map((application) =>
            application._id === id
              ? { ...application, status }
              : application
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Status Error:", error);
      alert("Backend se connection nahi ho raha hai.");
    }
  };

  return (
    <div>
      <h1>Applicants</h1>

      {applications.length === 0 ? (
        <p>No applicants found.</p>
      ) : (
        applications.map((application) => (
          <div
            key={application._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "15px",
              borderRadius: "10px"
            }}
          >
            <h3>{application.jobTitle}</h3>

            <p>
              <strong>Student Email:</strong>{" "}
              {application.studentEmail}
            </p>

            <p>
              <strong>Company:</strong>{" "}
              {application.company}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {application.status}
            </p>

            <button
              onClick={() =>
                updateStatus(
                  application._id,
                  "Shortlisted"
                )
              }
            >
              Shortlist
            </button>

            {" "}

            <button
              onClick={() =>
                updateStatus(
                  application._id,
                  "Rejected"
                )
              }
            >
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Applicants;