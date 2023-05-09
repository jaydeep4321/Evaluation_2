const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
const tokenRoute = require("./routes/tokenRoute");
const questionRoute = require("./routes/questionRoute");
const quizRoute = require("./routes/quizRoute");
// const answerRoute = require("./routes/answerRoute");
const session = require("express-session");

const app = express();

app.use(
  session({
    secret: "your-secret-key-here",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json({ limit: "10kb" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", tokenRoute);
app.use("/api/v1/quiz", quizRoute);
app.use("/api/v1/questions", questionRoute);
// app.use("/api/v1/answers", answerRoute);

module.exports = app;
