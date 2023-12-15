const express = require("express");
const { ProfileModel } = require("../models/Profile.Model");
const { UserModel } = require("../models/User.Model");
const profileRouter = express.Router();

profileRouter.get("/", async (req, res) => {
    const results = await UserModel.find().select("_id name email timestamp");

  res.json({ profile: results });
});

module.exports = { profileRouter };
