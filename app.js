const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
const tokenRoute = require("./routes/tokenRoute");
const questionRoute = require("./routes/questionRoute");
const quizRoute = require("./routes/quizRoute");
// const answerRoute = require("./routes/answerRoute");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const Quiz = require("./models/quizModel");
const User = require("./models/userModel");
const Question = require("./models/questionModel");

const app = express();

// Creating Http Server from Express App to work with socket.io
const server = require("http").createServer(app);
// Initializing socket.io object

const io = require("socket.io")(server);
global.io = io;
// io.on("connection", (socket) => {
//   // app.set("socket", socket);
//   console.log("socket", { socket });
// });
// app.set("io", io);

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

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

// io.on("connection", (socket) => {
//   console.log("New Client is Connected!");

//   socket.emit("welcome", );
//   socket.on("chat message", (msg) => {
//     console.log("message: " + msg);
//   });
//   socket.emit("asking", "how are you?");
// });

// io.on("connection", function (socket) {
//   console.log("A user connected");
//   // Send a message when
//   setTimeout(function () {
//     // Sending an object when emmiting an event
//     socket.emit("testerEvent", {
//       description: "A custom event named testerEvent!",
//     });
//   }, 4000);

//   socket.emit("getData", function (data) {});
//   socket.on("disconnect", function () {
//     console.log("A user disconnected");
//   });
// });

//======================= First Success full attempt  for fetching quiz=====================//
io.on("connection", async (req, res, next) => {
  console.log("A user connected");

  const quiz = await Quiz.find();

  io.emit("recieveData", quiz);
  // Send a message when
  // setTimeout(function () {
  //   // Sending an object when emmiting an event
  //   socket.emit("testerEvent", {
  //     description: "A custom event named testerEvent!",
  //   });
  // }, 4000);

  // socket.emit("getData", function (data) {});
  // socket.on("disconnect", function () {
  //   console.log("A user disconnected");
  // });
});

//======================= emit question (failed)=================//
// io.of("/:id").on("connection", async (req, res, next) => {
//   console.log("user connected");
//   const question = await Question.findById(req.query.id);

//   io.emit("recievedQuestion", question);
// });

//======================= emit all question (successfull)==============//
io.on("connection", async (req, res, next) => {
  console.log("user connected");
  const questions = await Question.find();

  io.emit("recievedQuestion", questions);
});

//========================= emit quiz and show question on interval ================ //
io.on("connection", async (req, res, next) => {
  console.log("user connected again");
  const quiz = await Quiz.find();

  io.emit("recievedQuestion", async function (quiz) {
    console.log(quiz.question.length);
    if (quiz.question.length > 0) {
      for (let i = 0; i <= quiz.question.length; i++) {
        const question = await Question.findOne({ id: quiz.question[i] });

        io.emit("gettingQuestion", question);
      }
    }
  });
});
server.listen(process.env.PORT, process.env.HOST, () =>
  console.log(`Listening on http://${process.env.HOST}:${process.env.PORT}/`)
);

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", tokenRoute);
app.use("/api/v1/quiz", quizRoute);
app.use("/api/v1/questions", questionRoute);
// app.use("/api/v1/answers", answerRoute);

module.exports = app;
