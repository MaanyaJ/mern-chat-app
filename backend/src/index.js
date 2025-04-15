import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./lib/db.js";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import cookieParser from "cookie-parser"
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"
import { app, server } from "./lib/socket.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT;
const dirname = path.resolve();

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true 
}))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(dirname, "../frontend", "dist", "index.html"));
    })
}

server.listen(PORT, () =>{
    console.log("server is running on port: " + PORT);
    connectDB();
});