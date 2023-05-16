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
const AppError = require("./utils/appError");
const globalErrorcontroller = require("./controller/errorController");
const authController = require("./controller/authController");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);
// global.io = io;

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

//================================emit quiz and show question with timer  ========================//

io.on("connection", async (socket) => {
  const quizzes = await Quiz.find();
  let quizIndex = 0;
  let questionIndex = 0;
  let timeLeft = 30;

  const timer = setInterval(() => {
    socket.emit("timerUpdate", timeLeft);
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(timer);
      socket.emit("quizOver");
    }
  }, 1000);

  const askQuestion = async (quizIndex, questionIndex) => {
    const quiz = quizzes[quizIndex];
    const questionIds = quiz.questions.map((q) => q._id);
    const question = await Question.findOne({
      _id: questionIds[questionIndex],
    });
    socket.emit("gettingQuestion", question);

    socket.once("getAns", async (ans) => {
      // const question = quiz.questions[questionIndex];
      // console.log(question)

      const question = await Question.findOne({
        _id: questionIds[questionIndex],
      });
      // console.log(question)

      const options = question.options;
      // console.log(options);
      if (!options) {
        return socket.emit("error", "Options not found!");
      }
      const correctOption = options.find((option) => option.isCorrect);
      const isCorrect = correctOption.optionTitle === ans;
      const score = isCorrect ? question.score : 0;

      const user = await User.findByIdAndUpdate(
        socket.handshake.query.id,
        // console.log(socket.handshake.query.id),
        {
          $inc: {
            totalScore: score,
          },
        },
        { new: true }
      );

      console.log(user);
      if (!user) {
        return socket.emit("error", "User not found!");
      }

      const nextQuestionIndex = questionIndex + 1;
      if (nextQuestionIndex < questionIds.length) {
        setTimeout(() => {
          askQuestion(quizIndex, nextQuestionIndex);
        }, 30000);
      } else {
        const nextQuizIndex = quizIndex + 1;
        if (nextQuizIndex < quizzes.length) {
          setTimeout(() => {
            askQuestion(nextQuizIndex, 0);
          }, 30000);
        } else {
          socket.emit("quizOver", "quiz over");
        }
      }
    });
  };

  askQuestion(0, 0);
});

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
