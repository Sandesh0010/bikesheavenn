const Bikes = require("../models/bikesSchema.js");
const multer = require("multer");
const {
  cloudinaryStorage,
  CloudinaryStorage,
} = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary.js");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bikes",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

// To get all bikes
const getBikes = async (req, res) => {
  try {
    const bikes = await Bikes.find({ forSale: { $ne: true } })
      .populate("createdBy", "email _id")
      .sort({ createdAt: -1 });
    res.status(200).json(bikes);
  } catch (error) {
    console.error("Error fetching bikes:", error);
    res.status(500).json({ message: error.message });
  }
};

// To get bikes created by the authenticated user
const getMyBikes = async (req, res) => {
  try {
    const { type } = req.query;
    let query = { createdBy: req.user.id };

    if (type === "sale") {
      query.forSale = true;
    } else if (type === "blog") {
      query.forSale = { $ne: true };
    }

    const bikes = await Bikes.find(query);
    res.status(200).json(bikes);
  } catch (error) {
    console.error("Error fetching user bikes:", error);
    res.status(500).json({ message: error.message });
  }
};

// To get bikes for sale in marketplace
const getMarketplaceBikes = async (req, res) => {
  try {
    const bikes = await Bikes.find({ forSale: true })
      .populate("createdBy", "email _id")
      .sort({ createdAt: -1 });
    res.status(200).json(bikes);
  } catch (error) {
    console.error("Error fetching marketplace bikes:", error);
    res.status(500).json({ message: error.message });
  }
};

//To get bike by ID
const getBike = async (req, res) => {
  try {
    const bike = await Bikes.findById(req.params.id);
    res.status(200).json(bike);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TO add a bike
const addBike = async (req, res) => {
  console.log(req.user); // displaying user information using token
  const {
    title,
    brand,
    model,
    price,
    description,
    condition,
    forSale,
    contactInfo,
    odometer,
    location,
  } = req.body;

  // Check if image file is provided
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  if (!title || !brand || !model || !price || !description) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  // If bike is for sale, require all marketplace fields
  const isBikeForSale = forSale === true || forSale === "true";
  if (isBikeForSale && (!condition || !contactInfo || !odometer || !location)) {
    return res.status(400).json({
      message:
        "Condition, contact information, odometer reading, and location are required for bikes listed for sale",
    });
  }

  try {
    console.log(
      "Executing addBike with image path:",
      req.file ? req.file.path : "No file",
    );
    const addBike = new Bikes({
      title,
      brand,
      model: Number(model),
      price: Number(price),
      description,
      condition: condition || undefined,
      image: req.file.path,
      createdBy: req.user.id,
      forSale: isBikeForSale,
      contactInfo: contactInfo || undefined,
      odometer: isBikeForSale ? Number(odometer) : 0,
      location: location || undefined,
    });

    const newBike = await addBike.save();
    res.status(201).json(newBike);
  } catch (error) {
    console.error("Error adding bike:", error);
    res.status(500).json({ message: error.message });
  }

  // return res.json(bike);
};

// TO  edit a bike info
const editBike = async (req, res) => {
  try {
    const bikeToEdit = await Bikes.findById(req.params.id);
    if (!bikeToEdit) {
      return res.status(404).json({ message: "Bike not found" });
    }

    // Check if user is the owner of the bike OR an admin
    if (bikeToEdit.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this item" });
    }

    const updatedData = { ...req.body };
    if (req.file) {
      updatedData.image = req.file.path;
    }

    const updatedBike = await Bikes.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
      },
    );
    res.status(200).json({ message: "Bike updated successfully", updatedBike });
  } catch (error) {
    console.error("Error updating bike:", error);
    res.status(500).json({ message: error.message });
  }
};

// TO delete a bike
const deleteBike = async (req, res) => {
  const id = req.params.id;

  try {
    // First check if bike exists and user is the owner
    const bike = await Bikes.findById(id);
    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    // Check if user is the owner of the bike OR an admin
    if (bike.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this item" });
    }

    await Bikes.deleteOne({ _id: id });
    res.status(200).json({ message: "Bike Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting bike:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBikes,
  getMyBikes,
  getMarketplaceBikes,
  getBike,
  addBike,
  editBike,
  deleteBike,
  upload,
};
