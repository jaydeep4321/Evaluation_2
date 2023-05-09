const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

// const DB = process.env.DATABASE_LOCAL.replace(
//   "<password>",
//   process.env.DATABASE_PASSWORD
// );

const DB = process.env.DATABASE_LOCAL;

//Database connection
mongoose.connect(DB).then(() => console.log("DB connection successful!"));

//server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
