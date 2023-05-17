const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./modules/user/route/userRoute");
const questionRoute = require("./modules/question/route/questionRoute");
const quizRoute = require("./modules/quiz/route/quizRoute");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const AppError = require("./utils/appError");
const globalErrorcontroller = require("./controller/errorController");
const authController = require("./controller/authController");
const app = express();
const socketIo = require("./socket/socketIo");

const server = require("http").createServer(app);
// const io = require("socket.io")(server);

app.use(
  session({
    secret: "your-secret-key-here",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.json({ limit: "10kb" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

socketIo(server);

server.listen(process.env.PORT, process.env.HOST, () =>
  console.log(`Listening on http://${process.env.HOST}:${process.env.PORT}/`)
);

app.use("/api/v1/users", userRoute);
app.use("/api/v1/quiz", quizRoute);
app.use("/api/v1/questions", questionRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorcontroller);

module.exports = app;
