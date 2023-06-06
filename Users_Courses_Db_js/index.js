const Joi = require('joi');
const express = require('express');// import express
const app = express();
app.use(express.json());

const coursesRouter = require("./routes/courses")//importing courses.js file
const userRouter = require("./routes/users")//importing users.js file

app.use("/api/courses", coursesRouter);
app.use("/api/users", userRouter);


// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
