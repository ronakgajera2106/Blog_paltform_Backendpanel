require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { log } = require("mercedlogger");
const cors = require("cors");
const indexRouter = require("./routes/index");

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

// app.get("/", () => {
//   res.send("this is the test route to make sure server is working");
// });

app.use("", indexRouter);

app.listen(PORT, () => log.green("SERVER STATUS", `Listening on port ${PORT}`));
