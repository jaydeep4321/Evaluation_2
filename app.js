const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
const questionRoute = require("./routes/questionRoute");
const quizRoute = require("./routes/quizRoute");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const Quiz = require("./models/quizModel");
const User = require("./models/userModel");
const Question = require("./models/questionModel");
const authController = require("./controller/authController");
const { log } = require("console");

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
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.json({ limit: "10kb" }));

//socket.io middleware for  authentication
// const wrap = (middleware) => (socket, next) =>
//   middleware(socket.request, {}, next);

// const sharedsession = require("express-socket.io-session");
// io.use(sharedsession(session));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//============================= socket.io practice ===========================//
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
// io.on("connection", async (socket) => {
//   console.log("A user connected");

//   const quiz = await Quiz.find();

//   socket.emit("recieveData", quiz);
//   socket.on("giveResponse", function (response) {
//     if (respn) socket.off("giveResponse");
//   });

//   // =====================//
//   // Send a message when
//   // setTimeout(function () {
//   //   // Sending an object when emmiting an event
//   //   socket.emit("testerEvent", {
//   //     description: "A custom event named testerEvent!",
//   //   });
//   // }, 4000);

//   // socket.emit("getData", function (data) {});
//   // socket.on("disconnect", function () {
//   //   console.log("A user disconnected");
//   // });
// });

//======================= emit question (failed)=================//
// io.of("/:id").on("connection", async (req, res, next) => {
//   console.log("user connected");
//   const question = await Question.findById(req.query.id);

//   io.emit("recievedQuestion", question);
// });

//======================= emit all question (successfull)==============//
// io.on("connection", async (req, res, next) => {
//   console.log("user connected");
//   const questions = await Question.find();

//   io.emit("recievedQuestion", questions);
// });

//========================= emit quiz and show question on interval ================ //
// io.on("connection", async (req, res, next) => {
//   console.log("user connected again");
//   const quiz = await Quiz.find();

//   io.emit("recievedQuestion", async function (quiz) {
//     console.log(quiz.question.length);
//     if (quiz.question.length > 0) {
//       for (let i = 0; i < quiz.question.length; i++) {
//         const question = await Question.findOne({ _id: quiz.question[i] });

//         io.emit("gettingQuestion", question);
//       }
//     }
//   });
// });

// ========================== emit quiz and show question on separate (success) ===========================/

// io.on("connection", async (socket) => {
//   console.log("user connected again");
//   const quizzes = await Quiz.find();

//   quizzes.forEach(async (quiz) => {
//     const questionIds = quiz.questions.map((q) => q.question);

//     if (questionIds.length > 0) {
//       for (let i = 0; i < questionIds.length; i++) {
//         const question = await Question.findOne(questionIds[i]);

//         console.log(question);

//         socket.emit("gettingQuestion", question);
//       }
//     }
//   });
// });

// ========================== only allow authentication middleware ===============//
// io.use((socket, next) => {
//   const session = socket.request.session;
//   if (session && session.authenticated) {
//     next();
//   } else {
//     next(new Error("unauthorized"));
//   }
// });

//================================emit quiz and show question with timer  ========================//
io.on("connection", async (socket, req, res, next) => {
  // if (!req.session) {
  //   return res.status(401).json({ error: true, message: "Unauthorized" });
  // }
  // next();
  // console.log(socket);
  // console.log("with timer");
  const quizzes = await Quiz.find();
  let timeLeft = 30;

  const timer = setInterval(() => {
    socket.emit("timerUpdate", timeLeft);
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(timer);
    }
  }, 1000);

  let delay = 0;
  quizzes.forEach(async (quiz) => {
    const questionIds = quiz.questions.map((q) => q._id);

    if (questionIds.length > 0) {
      for (let i = 0; i < questionIds.length; i++) {
        setTimeout(async () => {
          const question = await Question.findOne({ _id: questionIds[i] });

          // io.on("getAns", function (ans) {
          //   //=======ans comparision code here======//
          //   // const isCorrect = true
          //   // if(ans === question.option.isCorrect)
          // });

          // console.log(question);
          socket.emit("gettingQuestion", question);

          socket.on("getAns", async (ans, next) => {
            console.log("===> logging query", req.query);
            if (ans === question.options.optionText) {
              console.log("process is on");
              const user = await User.findByIdAndUpdate(
                { _id: req.query.id },
                { $set: { totalScore: totlaScore + score } }
              );

              if (!user) {
                return next(new Error("user not found!"), 404);
              }
            } else {
              console.log("you have choosed wrong option");
            }
          });
        }, delay);
        delay += 30000;
      }
    }
  });
});

server.listen(process.env.PORT, process.env.HOST, () =>
  console.log(`Listening on http://${process.env.HOST}:${process.env.PORT}/`)
);

app.use("/api/v1/users", userRoute);
app.use("/api/v1/quiz", quizRoute);
app.use("/api/v1/questions", questionRoute);

// app.use("/api/v1/answers", answerRoute);

module.exports = app;
