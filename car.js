const fs = require("fs");
const csv = require("csvtojson");
const mongoose = require("mongoose");
require("dotenv/config");
const Car = require("./models/Car");

mongoose.connect(process.env.MONGO_URI, () => {
  console.log("Connected to Database!");
});

const car = async () => {
  let newCar = await csv().fromFile("data.csv");
  newCar = newCar.map((e) => {
    return {
      make: e.Make,
      model: e.Model,
      release_date: e.Year,
      transmission_type: e["Transmission Type"],
      size: e["Vehicle Size"],
      style: e["Vehicle Style"],
      price: e.MSRP,
    };
  });
  Car.create(newCar);
};
