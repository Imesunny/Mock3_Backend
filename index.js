const express = require("express");
const { connection } = require("./config/db");
const { UserModel } = require("./models/User.Model");
const app = express();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { profileRouter } = require("./routes/profile.routes");
const { calculateRouter } = require("./routes/calculator.routes");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from the backend Home Page!!" });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const isUser = await UserModel.findOne({ email: email });

    if (isUser) {
      return res.json({ message: "User already registered, Try Again!" });
    }

    bcrypt.hash(password, 8, async (err, hash) => {
      await UserModel.create({
        name: name,
        email: email,
        password: hash,
      });

      return res.json({ message: "User registered successfully" });
    });
  } catch (error) {
    console.log(error, "User registration failed");
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const is_User = await UserModel.findOne({ email: email });
  if (is_User) {
    const hashed_password = is_User.password;
    bcrypt.compare(password, hashed_password, (err, result) => {
      if (result) {
        const token = jwt.sign({ UserID: is_User._id }, "helloDev");
        return res.json({ message: "Login Success", token: token });
      } else {
        return res.json({ message: "Invalid crediantials Try Again!" });
      }
    });
  } else {
    return res.json({ message: "User Not Found, Try Signning in again!" });
  }
});

app.use('/profile',profileRouter);
app.use('/calculate', calculateRouter)

app.listen(8000, async () => {
  try {
    await connection;
    console.log("Connected to Database");
  } catch (error) {
    console.log("error connecting to the Database", error);
  }
  console.log("Listening on port 8000");
});
