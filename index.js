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
app.use(cors({
  origin: 'http://localhost:3000', // Permite solicitações apenas do seu domínio local
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(cookieParser())
app.use(express.json())
app.use("/", Route)



app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})