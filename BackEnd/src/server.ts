import express, { Express } from "express";
import mainRouter from "./routes/index";
import cors from "cors"; 
import dotenv from "dotenv";

dotenv.config();


const app: Express = express();

const corsOptions ={
  origin:'https://gpt4enem.onrender.com', 
  credentials:true,
  optionSuccessStatus:200
}

app.use(cors(corsOptions));
  
app.use(mainRouter);

app.listen(80, () => {
    console.log('Aplicação rodando');
});
