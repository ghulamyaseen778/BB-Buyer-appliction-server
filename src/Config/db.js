import mongoose from "mongoose";

const connectDB=()=>{
    mongoose.connect(process.env.MONGO_DB_URI)
.then((conn)=>{
    console.log(`Server Connected ${conn.connection.host}`.cyan.bold)
})
.catch((error)=>{
    console.log(`Server Not Connected ${conn.connection.host}`.red.underline.bold)
})
}

export default connectDB
