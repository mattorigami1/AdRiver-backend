const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// Bringing User Route
const users = require("./routes/api/users");
const videos = require("./routes/api/videos");

app.use(cors());

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "100mb",
    parameterLimit: 10000000,
  })
);

app.use(
  bodyParser.json({
    limit: "50mb",
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("Server Running Fine");
});

app.use(bodyParser.json());
// DB Config
const db = process.env.mongoURI;
// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

mongoose.set("useFindAndModify", false);

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// Routes
app.use("/users", users);
app.use("/videos", videos);

const port = 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
