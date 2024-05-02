const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan"); // Import morgan
const authRouter = require("./routes/auth");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(morgan("dev")); // Use morgan with the 'dev' format
app.use(authRouter);
const DB =
  "mongodb+srv://rabbi:jamadrac@cluster0.p6m8ftv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(DB)
  .then(() => {
    console.log(" db Connection Successful");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});
