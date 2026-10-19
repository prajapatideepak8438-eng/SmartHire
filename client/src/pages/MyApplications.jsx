import { useEffect, useState } from "react";

function MyApplications() {

  const [applications, setApplications] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // ================= FETCH APPLICATIONS =================

  useEffect(() => {

    if (!user) {
      return;
    }

    fetch(
      `http://localhost:5000/api/applications?studentEmail=${user.email}`
    )

      .then((response) => response.json())

      .then((data) => {

        console.log(
          "My Applications:",
          data
        );

        setApplications(data);

      })

      .catch((error) => {

        console.log(
          "Applications Error:",
          error
        );

      });

  }, []);


  // ================= STATUS STYLE =================

  const getStatusStyle = (status) => {

    if (status === "Shortlisted") {

      return {
        background: "#dcfce7",
        color: "#166534"
      };

    }

    if (status === "Rejected") {

      return {
        background: "#fee2e2",
        color: "#991b1b"
      };

    }

    return {
      background: "#fef3c7",
      color: "#92400e"
    };

  };


  // ================= UI =================

  return (

    <div>

      <h1>My Applications</h1>


      {user && (

        <p>
          Student: <strong>{user.name}</strong>
        </p>

      )}


      {applications.length === 0 ? (

        <p>
          You have not applied for any job yet.
        </p>

      ) : (

        applications.map((application) => (

          <div
            key={application._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "15px",
              borderRadius: "10px",
              background: "#ffffff"
            }}
          >

            <h2>
              {application.jobTitle}
            </h2>


            <p>
              🏢 <strong>
                {application.company}
              </strong>
            </p>


            <p>
              📧 {application.studentEmail}
            </p>


            <p>

              📌 Status:{" "}

              <span
                style={{
                  ...getStatusStyle(
                    application.status
                  ),
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  display: "inline-block"
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