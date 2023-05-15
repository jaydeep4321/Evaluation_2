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


//================== authentication ====================//
io.use((socket, next) => {
  const cookie = socket.request.headers.cookie;
  if (cookie) {
    const sessionId = cookie.split('=')[1];
    socket.server.sessionStore.get(sessionId, (err, session) => {
      if (err || !session) {
        return next(new Error('Authentication error'));
      } else {
        socket.session = session;
        return next();
      }
    });
  } else {
    return next(new Error('Authentication error no cookie'));
  }
});


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

      const question = await Question.findOne({_id: questionIds[questionIndex]});
      // console.log(question)

      const options = question.options;
      // console.log(options);
      if (!options) {
        return socket.emit("error", "Options not found!");
      }
      const correctOption = options.find((option) => option.isCorrect);
      const isCorrect = correctOption.optionText === ans;
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
  
      console.log(user)
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

// app.use("/api/v1/answers", answerRoute);

module.exports = app;
