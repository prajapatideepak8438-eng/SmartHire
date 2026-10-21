import { useEffect, useState } from "react";
import API_URL from "../api";

function MyApplications() {
  const [applications, setApplications] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      return;
    }

    fetch(
      `${API_URL}/api/applications?studentEmail=${encodeURIComponent(
        user.email
      )}`
    )
      .then((response) => response.json())
      .then((data) => setApplications(data))
      .catch((error) =>
        console.log("Applications Error:", error)
      );
  }, []);

  return (
    <div>
      <h1>My Applications</h1>

      {applications.length === 0 ? (
        <p>You have not applied for any job yet.</p>
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
              <strong>Company:</strong>{" "}
              {application.company}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  fontWeight: "bold"
                }}
              >
                {application.status}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyApplications;