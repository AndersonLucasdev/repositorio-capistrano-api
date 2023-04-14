import express from 'express'
import Route from "./src/routes/routes.js"
import bodyParser from 'body-parser'
import connectDatabase from './src/database/db.js'


const app = express()
const port = 3000

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
connectDatabase()

app.use(express.json())
app.use("/", Route)


app.listen(port)