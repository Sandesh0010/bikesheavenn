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
    const bikes = await Bikes.find();
    res.status(200).json(bikes);
  } catch (error) {
    res.status(402).json({ message: error.message });
  }
};

// To get bikes created by the authenticated user
const getMyBikes = async (req, res) => {
  try {
    const bikes = await Bikes.find({ createdBy: req.user.id });
    res.status(200).json(bikes);
  } catch (error) {
    res.status(402).json({ message: error.message });
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
  const { title, brand, model, price, description } = req.body;

  if (!title || !brand || !model || !price || !description) {
    return res.status(402).json({ message: "Please fill all the fields" });
  }

  try {
    const addBike = new Bikes({
      title,
      brand,
      model,
      price,
      description,
      image: req.file ? req.file.path : "", // Make image optional
      createdBy: req.user.id,
    });
    await addBike.save();
    res.status(200).json({ message: "Bike added successfully", addBike });
  } catch (error) {
    res.status(402).json({ message: error.message });
  }

  // return res.json(bike);
};

// TO  edit a bike info
const editBike = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    if (req.file) {
      updatedData.image = req.file.path;
    }

    const updatedBike = await Bikes.findByIdAndUpdate(
      req.params.id,
      updatedData,

      {
        new: true,
      }
    );
    res.status(200).json({ message: "Bike updated successfully", updatedBike });
  } catch (error) {
    res.status(402).json({ message: error.message });
  }
};

// TO delete a bike
const deleteBike = async (req, res) => {
  const id = req.params.id;

  try {
    const delbike = await Bikes.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Bike Deleted Successfully" });
  } catch (error) {
    res.status(402).json({ message: error.message });
  }
};

module.exports = {
  getBikes,
  getMyBikes,
  getBike,
  addBike,
  editBike,
  deleteBike,
  upload,
};
