const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
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
app.use(session({
  secret: "admin-secret-key",
  resave: false,
  saveUninitialized: false
}));

/* =========================
   MongoDB Connection
========================= */
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err.message));

/* =========================
   Schema
========================= */
const RequestSchema = new mongoose.Schema({
  service: String,
  vehicle: String,
  year: String,
  phone: String,
  location: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const Request = mongoose.model("Request", RequestSchema);

/* =====================================================
   ✅ STEP-2: FRONTEND STATIC SERVE (VERY IMPORTANT)
===================================================== */
app.use(express.static(path.join(__dirname, "../frontend")));

/* =====================================================
   ✅ STEP-3: ROOT ROUTE
===================================================== */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin-login.html"));
});

/* =========================
   ADMIN LOGIN API
========================= */
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "12345") {
    req.session.admin = true;
    return res.json({ success: true });
  }

  res.json({ success: false });
});

/* =========================
   ADMIN LOGOUT API
========================= */
app.get("/admin/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

/* =========================
   AUTH MIDDLEWARE
========================= */
function isAdmin(req, res, next) {
  if (req.session.admin) return next();
  res.redirect("/admin-login.html");
}

/* =========================
   PROTECT ADMIN PAGE
========================= */
app.get("/admin.html", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

app.get("/admin", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

/* =========================
   ADMIN DATA API
========================= */
app.get("/admin/requests", isAdmin, async (req, res) => {
  const data = await Request.find().sort({ createdAt: -1 });
  res.json(data);
});

/* =========================
   FORM SUBMIT API
========================= */
app.post("/request", async (req, res) => {
  try {
    await Request.create(req.body);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 2018;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
