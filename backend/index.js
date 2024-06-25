require('dotenv').config();
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const data=require('./src/data/data.js')
const dbConnection= require("./src/config/dataBase.connection.js")
const userRoutes= require("./src/route/userRoutes.js")
const chatRoutes= require("./src/route/chatRoutes.js")
const messageRoutes= require("./src/route/messageRoutes.js")
const app = express()
const port =process.env.PORT||  3000
const dbUrl = process.env.MONGODB_URL;
app.use(cors());
app.use(bodyParser.json());

dbConnection();  

app.use(express.json()); // to accept json data

app.get("/",(req,res)=>{
  res.send(" server runing succesfully");
})
app.use("/api/user",userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})