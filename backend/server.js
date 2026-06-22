import http from 'http'
import app from "./src/app.js"
//config import

import { initializeSocket } from './src/socket/socket.js'

import  { config } from "./src/config/config.js"
import connectDB from "./src/config/db.js"

const server = http.createServer(app);

const PORT = config.PORT || 3000

initializeSocket(server)

connectDB()
server.listen( PORT, ()=>{
    console.log(`server is running at port : ${PORT}`);
})


