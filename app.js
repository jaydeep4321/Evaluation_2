const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
const tokenRoute = require("./routes/tokenRoute");
const questionRoute = require("./routes/questionRoute");
const answerRoute = require("./routes/answerRoute");

const app = express();

app.use(express.json({ limit: "10kb" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", tokenRoute);
app.use("/api/v1/questions", questionRoute);
app.use("/api/v1/answers", answerRoute);

module.exports = app;
