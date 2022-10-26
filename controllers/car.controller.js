const mongoose = require("mongoose");
const Car = require("../models/Car");
const carController = {};
const { sendResponse, AppError } = require("../helpers/utils.js");

carController.createCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const { make, model, release_date, transmission_type, size, style, price } =
      req.body;
    //control inputs
    if (
      !make ||
      !model ||
      !release_date ||
      !transmission_type ||
      !size ||
      !style ||
      !price
    )
      throw new AppError(402, "Bad Request", "Missing body info");
    //mongoose query
    const created = await Car.create(req.body);
    sendResponse(res, 200, true, { data: created }, null, "Create Car Success");
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.getCars = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    let cars = await Car.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCars = await Car.find({ isDeleted: false }).count();

    const total = Math.ceil(totalCars / limit);
    const data = { cars, total, page };

    sendResponse(res, 200, true, data, null, "Found list of cars success");
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.editCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const { id } = req.params;
    const updateCar = await Car.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    if (!updateCar) throw new AppError(404, "Bad Request", "Car not found ");

    sendResponse(res, 200, true, updateCar, null, "Update car success");
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.deleteCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      throw new AppError(402, "Bad Request", "Invalid ID");
    const deletedCar = await Car.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!updateCar) throw new AppError(404, "Bad Request", "Car not found ");
    sendResponse(res, 200, true, deletedCar, null, "Delete car success");
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

module.exports = carController;
