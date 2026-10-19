import { useState } from "react";

function PostJob() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handlePostJob = async () => {

    if (!title || !location || !salary || !description) {
      alert("Please fill all fields!");
      return;
    }

    if (!user || user.role !== "recruiter") {
      alert("Only recruiters can post jobs!");
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:5000/api/jobs",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            title,
            company: user.name,
            location,
            salary,
            description,
            recruiterEmail: user.email
          })
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert("Job posted successfully!");

        setTitle("");
        setLocation("");
        setSalary("");
        setDescription("");

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.log("Error:", error);

      alert(
        "Backend se connection nahi ho raha hai. Check karo ki server running hai."
      );

    }
  };

  return (
    <div className="register-page">

      <h1>Post New Job</h1>

      {user && (
        <p>
          <strong>Company:</strong> {user.name}
        </p>
      )}

      <input
        type="text"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
      />

      <br />
      <br />

      <textarea
        placeholder="Job Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handlePostJob}>
        Post Job
      </button>

    </div>
  );
}

export default PostJob;