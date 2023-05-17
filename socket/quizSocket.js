const socketIo = require("socket.io");
const Quiz = require("../modules/quiz/models/quizModel");
const User = require("../modules/user/models/userModel");
const Question = require("../modules/question/models/questionModel");


module.exports = (server) => {
  const io = socketIo(server);

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
};