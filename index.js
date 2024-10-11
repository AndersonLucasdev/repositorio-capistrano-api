import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from "dotenv"
import Route from "./src/routes/routes.js"


dotenv.config()


const app = express()
const port = 3000



app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
})); 
const allowedOrigins = ['http://localhost:3000', 'https://capistrano-frontend.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(cookieParser())
app.use(express.json())
app.use("/", Route)



app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})