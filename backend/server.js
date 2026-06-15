import app from "./src/app.js"
//config import
import  { config } from "./src/config/config.js"
import connectDB from "./src/config/db.js"

const PORT = config.PORT || 3000


connectDB()
app.listen( PORT, ()=>{
    console.log(`server is running at port : ${PORT}`);
})


