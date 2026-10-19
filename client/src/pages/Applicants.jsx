import { useEffect, useState } from "react";

function Applicants() {
  const [applications, setApplications] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    fetch("http://localhost:5000/api/applications")
      .then((response) => response.json())
      .then((data) => {

        // Logged-in recruiter ki company
        const companyName = user.name.toLowerCase();

        // Sirf apni company ke applicants
        const myApplications = data.filter(
          (application) =>
            application.company.toLowerCase() === companyName
        );

        setApplications(myApplications);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: status
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(`Application ${status}!`);

        setApplications((previousApplications) =>
          previousApplications.map((application) =>
            application._id === id
              ? { ...application, status: status }
              : application
          )
        );
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log("Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="jobs-page">
      <h1>View Applicants</h1>

      {user && (
        <p>
          Recruiter: <strong>{user.name}</strong>
        </p>
      )}

      {applications.length === 0 ? (
        <p>No applicants found for your company.</p>
      ) : (
        applications.map((application) => (
          <div className="job-card" key={application._id}>
            <h2>{application.jobTitle}</h2>

            <p>🏢 {application.company}</p>

            <p>
              📧 Student Email: {application.studentEmail}
            </p>

            <p>
              📌 Status:{" "}
              <strong>{application.status}</strong>
            </p>

            <button
              onClick={() =>
                updateStatus(
                  application._id,
                  "Shortlisted"
                )
              }
            >
              🟢 Shortlist
            </button>

            <button
              onClick={() =>
                updateStatus(
                  application._id,
                  "Rejected"
                )
              }
            >
              🔴 Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Applicants;