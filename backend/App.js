const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./routes/authRoute");
const product = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // React Vite app
    credentials: true,
  }),
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/auth", router);
app.use("/products", product);

app.get("/", (req, res) => {
  res.send("App is running on local host");
});

app.use(errorHandler);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
