const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const galleryRoute = require("./models/Gallery")
const cors = require('cors');
const multer = require("multer");

dotenv.config();

mongoose.connect('mongodb://127.0.0.1/my_project', (err) => {
	if (err) throw err;
	console.log("conected to server");
});

//middleware
app.use(cors({
	origin: '*'
}))
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));




app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/profile", galleryRoute);

app.listen(8800, () => {
	console.log("Backend server is running");
	console.log('https://localhost:8800');
});
