const express = require("express");
const mongoose = require("mongoose");
const Nutrition = require("../models/Nutrition");
const User = require("../models/User");
const router = express.Router();
router.get("/", (req, res) => {
  res.send("got it");
});
// const nutritionSchema = Schema({
//   user: { type: Schema.Types.ObjectId, ref: "User" },
//   date: Date,
//   total: Number,
//   meals: [{ foodName: String, calories: Number }],
// });
router.post("/", async (req, res) => {
  if (!(req.body.calories && req.body.foodName && req.body._id)) {
    return res.json({ error: "Missing fields" });
  }
  if (isNaN(req.body.calories)) {
    return res.json({
      error: "Please enter a number in the calories field",
    });
  }
  const currentDate = new Date().toISOString().slice(0, 10);
  if (req.body.save) {
    try {
      const savedMeals = await User.findOneAndUpdate(
        { _id: req.body._id },
        {
          $push: {
            savedMeals: {
              foodName: req.body.foodName,
              calories: req.body.calories,
            },
          },
        },
        { new: true }
      );
      console.log("SAVED MEALS", savedMeals);
    } catch (error) {
      console.error(error);
    }
  }

  try {
    const dailyEntry = await Nutrition.findOneAndUpdate(
      {
        user: req.body._id,
        date: currentDate,
      },
      {
        $set: { user: req.body._id },
        $set: { date: currentDate },
        $inc: { total: req.body.calories },
        $push: {
          meals: { foodName: req.body.foodName, calories: req.body.calories },
        },
      },
      { new: true, upsert: true }
    );
    return res.json({
      date: dailyEntry.date,
      meals: dailyEntry.meals,
      todayTotalCalories: dailyEntry.total,
    });
  } catch (error) {
    console.error(error);
    res.json({
      error: "There was a problem adding your meal please check your input",
    });
  }
  //   if (req.body.save) {
  //     try {
  //       const savedMeals = await User.findOneAndUpdate(
  //         { _id: req.body._id },
  //         {
  //           $push: {
  //             savedMeals: {
  //               foodName: req.body.foodName,
  //               calories: req.body.calories,
  //             },
  //           },
  //         },
  //         { new: true }
  //       );
  //       console.log("SAVED MEALS", savedMeals);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
});
module.exports = router;