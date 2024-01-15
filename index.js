import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";
import path from "path";

const __dirname = path.resolve(path.dirname(""));
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8800;

//connect to mongoDB
dbConnection();

//security middleware
app.use(helmet());

app.use(cors());
// Allow specific origin(s)
app.use(cors({
   origin: 'https://tamkeen-one.vercel.app'
 }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

//middleware to access to the views folder
app.use(express.static(path.join(__dirname, "views")));
//app.use(express.static("views"));

// router
app.use(router);
//error middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
