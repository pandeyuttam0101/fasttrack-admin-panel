const mongoose = require("mongoose");

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
      enum: ["Pending", "Accepted", "Waiting", "Cancelled"],
      default: "Pending"
    },

    emergency: {
      type: Boolean,
      default: false
    },

    // ✅ MECHANIC DETAILS
    mechanic: {
      name: String,
      phone: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema);
