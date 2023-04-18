import mongoose from "mongoose"


const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }).then(() => console.log("MongoDB Atlas connected")).catch((error) => console.log(error))

}





export default connectDatabase
