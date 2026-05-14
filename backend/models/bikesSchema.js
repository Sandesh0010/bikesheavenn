const mongoose = require("mongoose");

const bikesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    forSale: {
      type: Boolean,
      default: false,
    },
    contactInfo: {
      type: String,
      required: function () {
        return this.forSale;
      },
    },
    odometer: {
      type: Number,
      required: function () {
        return this.forSale;
      },
    },
    location: {
      type: String,
      required: false,
    },
    condition: {
      type: String,
      enum: ["Excellent", "Fair", "Bad"],
      required: function () {
        return this.forSale;
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Bikes", bikesSchema);
