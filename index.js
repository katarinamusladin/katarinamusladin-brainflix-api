import express from "express";
import cors from "cors";
import {v4 as uuidv4 } from "uuid";
import  "dotenv/config";
import router from "./routes/videos.js";


const app =express();
app.use(express.json());
app.use(express.static("public"));

const {PORT, CORS_ORIGIN} = process.env;
app.use(cors({origin: CORS_ORIGIN}));

app.route("/register").get((req,res)=>{
  res.json({api_key:uuidv4()})
})

app.use("/videos",router);

app.listen(PORT, ()=>{
  console.log(`App running on PORT: http://localhost:${PORT}/`);
})

app.get('/',function(req,res){
  res.send('This is my response.');
})