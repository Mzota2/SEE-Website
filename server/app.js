const express = require('express')
const studentsRoutes = require("./routes/students");
const authRoutes = require("./routes/auth");
const postsRoutes = require("./routes/posts");
const programsRoutes = require("./routes/programs");
const aboutRoutes = require("./routes/about");
const blogRoutes = require("./routes/blog");
const contactRoutes = require("./routes/contact");
const homeRoutes = require("./routes/home");
const leadersRoutes = require("./routes/leaders");
const teamRoutes = require("./routes/team");

const {refreshToken} = require('./controllers/auth');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const path = require("path");

const app = express()
const port = process.env?.PORT || 3000;
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors())

//routes
app.use("/api", studentsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", postsRoutes);
app.use("/api", programsRoutes);
app.use("/api", aboutRoutes);
app.use("/api", blogRoutes);
app.use("/api", contactRoutes);
app.use("/api", homeRoutes);
app.use("/api", leadersRoutes);
app.use("/api", teamRoutes);
app.get('/api/auth/refresh', refreshToken);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
