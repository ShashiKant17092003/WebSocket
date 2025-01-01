import express from 'express';
import dotenv from 'dotenv'; 
import cookieParser from 'cookie-parser';

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import connectToMongoDB from './db/connect.mongoDb.js';

const app =express();
dotenv.config(); 

const port = process.env.PORT || 3001

// app.get("/",(req,res) => {
//     res.send("<h1>Congratulations server is listening....</h1><a href='http://localhost:3000' target='_blank'>click here</a>")
// })

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

app.listen(port,() => {
    connectToMongoDB();
    console.log(`server is listening on port ${port} ...`);
})