const express = require('express')
const studentsRoutes = require("./routes/students");
const cookieParser = require('cookie-parser');
const cors = require("cors");

const app = express()
const port = process.env?.PORT || 3000;
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors())

//routes
app.use("/api", studentsRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
