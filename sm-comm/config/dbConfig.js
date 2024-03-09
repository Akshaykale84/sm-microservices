import mongoose from "mongoose";
import 'dotenv/config'
// const db = await mongoose.connect(process.env.MONGODB_URL);

async function getConn(){
    const db = await mongoose.connect(process.env.MONGODB_URL);
}

export default getConn;