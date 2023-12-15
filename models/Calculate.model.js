const mongoose = require("mongoose");

const calculateSchema = mongoose.Schema({
  AnnualInstalmentAmount: Number,
  AnnualInterestRate: Number,
  totalYears: Number,
});

const calculateModel = mongoose.model("calculate", calculateSchema);

module.exports = { calculateModel };
