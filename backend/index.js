import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import  dotenv from "dotenv"
dotenv.config({});

import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import quizRoute from "./routes/quiz.route.js"
import questionRoute from "./routes/question.route.js"
import quizAttemptRoute from './routes/quizAttempt.route.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOptions = {
    origin:'http//localhost:5173',
    credentials:true
}
app.use(cors(corsOptions));

const PORT = process.env.PORT ||3000;
app.use("/api/user",userRoute);
app.use("/api/quiz",quizRoute);
app.use("/api/question",questionRoute);
app.use("/api/quizAttempt",quizAttemptRoute);

app.listen(PORT,()=>{
    connectDB()
    console.log(`server is running on Port ${PORT}`);
})