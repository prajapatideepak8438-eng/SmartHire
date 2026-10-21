const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Application = require("./models/Application");
const Job = require("./models/Job");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// =====================================================
// MONGODB CONNECTION
// =====================================================
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/smarthire")

  .then(() => {
    console.log("MongoDB Connected Successfully");
  })

  .catch((error) => {
    console.log("MongoDB Connection Error:", error);
  });


// =====================================================
// BASIC ROUTES
// =====================================================

app.get("/", (req, res) => {

  res.send("SmartHire Backend is Running!");

});


app.get("/api/test", (req, res) => {

  res.json({
    message: "Backend API is working"
  });

});


// =====================================================
// REGISTER
// =====================================================

app.post("/api/register", async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role
    } = req.body;


    // -------------------------------------------------
    // HASH PASSWORD
    // -------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(password, 10);


    // -------------------------------------------------
    // CREATE NEW USER
    // -------------------------------------------------

    const newUser = new User({

      name,

      email,

      password: hashedPassword,

      role

    });


    await newUser.save();


    res.json({

      message: "User registered successfully"

    });


  } catch (error) {

    res.status(500).json({

      message: "Registration failed",

      error: error.message

    });

  }

});


// =====================================================
// LOGIN
// =====================================================

app.post("/api/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;
console.log("Login Email:", email);


    const user = await User.findOne({
      email: email
    });


    if (!user) {

      return res.status(404).json({

        message: "User not found"

      });

    }


    // -------------------------------------------------
    // PASSWORD CHECK
    // -------------------------------------------------

    const isPasswordValid =
      user.password.startsWith("$2")
        ? await bcrypt.compare(
            password,
            user.password
          )
        : user.password === password;


    if (!isPasswordValid) {

      return res.status(401).json({

        message: "Invalid password"

      });

    }


    // -------------------------------------------------
    // LOGIN SUCCESS
    // -------------------------------------------------

    res.json({

      message: "Login successful",

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role

      }

    });


  } catch (error) {

    res.status(500).json({

      message: "Login failed",

      error: error.message

    });

  }

});


// =====================================================
// STUDENTS
// =====================================================

app.get("/api/students", async (req, res) => {

  try {

    const students = await User.find({
      role: "student"
    });


    res.json(students);


  } catch (error) {

    res.status(500).json({

      message: "Students fetch failed",

      error: error.message

    });

  }

});


// =====================================================
// RECRUITERS
// =====================================================

app.get("/api/recruiters", async (req, res) => {

  try {

    const recruiters = await User.find({
      role: "recruiter"
    });


    res.json(recruiters);


  } catch (error) {

    res.status(500).json({

      message: "Recruiters fetch failed",

      error: error.message

    });

  }

});


// =====================================================
// APPLY FOR JOB
// =====================================================

app.post("/api/apply", async (req, res) => {

  try {

    const {
      studentEmail,
      jobTitle,
      company
    } = req.body;


    // -------------------------------------------------
    // CHECK DUPLICATE APPLICATION
    // -------------------------------------------------

    const existingApplication =
      await Application.findOne({

        studentEmail: studentEmail,

        jobTitle: jobTitle,

        company: company

      });


    if (existingApplication) {

      return res.status(400).json({

        message:
          "You have already applied for this job!"

      });

    }


    // -------------------------------------------------
    // CREATE NEW APPLICATION
    // -------------------------------------------------

    const newApplication =
      new Application({

        studentEmail,

        jobTitle,

        company

      });


    await newApplication.save();


    res.json({

      message:
        "Application submitted successfully"

    });


  } catch (error) {

    console.log(
      "Application Error:",
      error
    );


    res.status(500).json({

      message: "Application failed",

      error: error.message

    });

  }

});


// =====================================================
// GET APPLICATIONS
// =====================================================

app.get("/api/applications", async (req, res) => {

  try {

    const {
      studentEmail
    } = req.query;


    // -------------------------------------------------
    // STUDENT APPLICATIONS
    // -------------------------------------------------

    if (studentEmail) {

      const applications =
        await Application.find({

          studentEmail: studentEmail

        });


      return res.json(
        applications
      );

    }


    // -------------------------------------------------
    // ALL APPLICATIONS
    // Admin / Recruiter
    // -------------------------------------------------

    const applications =
      await Application.find();


    res.json(
      applications
    );


  } catch (error) {

    res.status(500).json({

      message:
        "Applications fetch failed",

      error: error.message

    });

  }

});


// =====================================================
// UPDATE APPLICATION STATUS
// =====================================================

app.put(
  "/api/applications/:id",
  async (req, res) => {

    try {

      const {
        status
      } = req.body;


      const application =
        await Application.findByIdAndUpdate(

          req.params.id,

          {
            status: status
          },

          {
            new: true
          }

        );


      if (!application) {

        return res.status(404).json({

          message:
            "Application not found"

        });

      }


      res.json({

        message:
          "Application status updated successfully",

        application:
          application

      });


    } catch (error) {

      res.status(500).json({

        message:
          "Status update failed",

        error: error.message

      });

    }

  }
);


// =====================================================
// GET JOBS
// =====================================================

app.get("/api/jobs", async (req, res) => {

  try {

    const jobs =
      await Job.find();


    res.json(jobs);


  } catch (error) {

    res.status(500).json({

      message:
        "Jobs fetch failed",

      error: error.message

    });

  }

});


// =====================================================
// POST JOB
// =====================================================

app.post("/api/jobs", async (req, res) => {

  try {

    const {
      title,
      company,
      location,
      salary,
      description,
      recruiterEmail
    } = req.body;


    // -------------------------------------------------
    // CHECK RECRUITER
    // -------------------------------------------------

    const recruiter = await User.findOne({
      email: recruiterEmail
    });


    if (!recruiter) {

      return res.status(404).json({

        message: "Recruiter not found"

      });

    }


    if (recruiter.role !== "recruiter") {

      return res.status(403).json({

        message:
          "Only recruiters can post jobs"

      });

    }


    // -------------------------------------------------
    // CHECK COMPANY NAME
    // -------------------------------------------------

    if (company !== recruiter.name) {

      return res.status(403).json({

        message:
          "You can only post jobs for your own company"

      });

    }


    // -------------------------------------------------
    // CREATE JOB
    // -------------------------------------------------

    const newJob =
      new Job({

        title,

        company,

        location,

        salary,

        description

      });


    await newJob.save();


    res.json({

      message:
        "Job posted successfully",

      job:
        newJob

    });


  } catch (error) {

    console.log(
      "Job Posting Error:",
      error
    );


    res.status(500).json({

      message:
        "Job posting failed",

      error: error.message

    });

  }

});


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {

  console.log(
    `Server running on http://localhost:${PORT}`
  );

});