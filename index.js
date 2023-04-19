import express from 'express'
import bodyParser from 'body-parser'
import connectDatabase from './src/database/db.js'
import Route from "./src/routes/routes.js"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'


dotenv.config()


const app = express()
const port = 3000

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

connectDatabase()

app.use(cookieParser())
app.use(express.json())
app.use("/", Route)



app.listen(port)