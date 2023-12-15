const express = require("express");
const { calculateModel } = require("../models/Calculate.model");
const calculateRouter = express.Router();

let calculatedData = null;

calculateRouter.post("/", async (req, res) => {
  try {
    const { AnnualInstalmentAmount, AnnualInterestRate, totalYears } = req.body;

    const i = AnnualInterestRate / 100;
    const n = totalYears;

    const totalAmounttoInvest = AnnualInstalmentAmount * n;

    const totalMaturityValue =
      AnnualInstalmentAmount * ((Math.pow(1 + i, n) - 1) / i);

    const totalInterestGained = totalMaturityValue - totalAmounttoInvest;

    console.log(totalInterestGained.toFixed(2));

    const new_CalculatedEntry = await calculateModel.create({
      totalAmounttoInvest,
      totalInterestGained,
      totalMaturityValue,
    });

    res.json({
      message: "New Entry",
      TotalInvestmentAmount: totalAmounttoInvest.toFixed(2),
      TotalInterestGained: totalInterestGained.toFixed(2),
      TotalMaturityValue: totalMaturityValue.toFixed(2),
    });
  } catch (error) {
    console.log("Error coming from calculation routes");
    console.log(error);
    res.json({ message: "Internal Server Error" });
  }
});

calculateRouter.get("/", async (req, res) => {
  try {
    const results = await calculateModel.find();
    res.json({ Data: results });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error retrieving calculated data" });
  }
});

module.exports = { calculateRouter };
