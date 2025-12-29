const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

/* =========================
   BODY PARSER
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   SESSION SETUP
========================= */
app.use(
  session({
    secret: "admin-secret-key",
    resave: false,
    saveUninitialized: false
  })
);

/* =========================
   MongoDB Connection
========================= */
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err.message));

/* =========================
   REQUEST SCHEMA
========================= */
const RequestSchema = new mongoose.Schema(
  {
    service: String,
    vehicle: String,
    year: String,
    phone: String,
    location: String,
    description: String,

    status: {
      type: String,
      default: "Pending"
    },

    emergency: {
      type: Boolean,
      default: false
    },

    // ✅ MECHANIC DETAILS
    mechanicName: String,
    mechanicPhone: String
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", RequestSchema);

/* =========================
   EMAIL CONFIG (SAFE)
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* =========================
   STATIC FRONTEND
========================= */
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

/* =========================
   ADMIN LOGIN
========================= */
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "12345") {
    req.session.admin = true;
    return res.json({ success: true });
  }
  res.json({ success: false });
});

function isAdmin(req, res, next) {
  if (req.session.admin) return next();
  res.redirect("/admin-login.html");
}

/* =========================
   ADMIN REQUEST LIST
========================= */
app.get("/admin/requests", isAdmin, async (req, res) => {
  const data = await Request.find().sort({ createdAt: -1 });
  res.json(data);
});

/* =========================
   ADMIN UPDATE STATUS
========================= */
app.put("/admin/request/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updateData = { status };

    // 🔥 AUTO ASSIGN MECHANIC
    if (status === "Accepted") {
      updateData.mechanicName = "Rahul";
      updateData.mechanicPhone = "9876543210";
    }

    await Request.findByIdAndUpdate(req.params.id, updateData);
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   ✅ STEP-4: CUSTOMER STATUS (LATEST REQUEST)
========================= */
app.get("/status/:phone", async (req, res) => {
  try {
    const phone = req.params.phone.trim();

    const request = await Request.findOne({ phone })
      .sort({ createdAt: -1 });

    if (!request) {
      return res.json({ success: false });
    }

    res.json({
      success: true,
      service: request.service,
      status: request.status,
      mechanic: request.mechanicName
        ? {
            name: request.mechanicName,
            phone: request.mechanicPhone
          }
        : null
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   ✅ STEP-3: FORM SUBMIT (PHONE CLEAN FIX)
========================= */
app.post("/request", async (req, res) => {
  try {
    const cleanPhone = req.body.phone?.trim();

    if (!cleanPhone) {
      return res.json({ success: false });
    }

    await Request.create({
      ...req.body,
      phone: cleanPhone
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 2025;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
