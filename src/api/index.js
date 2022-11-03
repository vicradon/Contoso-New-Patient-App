const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const cors = require("./utils/cors");
const fileRouter = require("./routes/fileRouter");
require("dotenv").config();

const port = process.env.PORT;

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", fileRouter);

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
