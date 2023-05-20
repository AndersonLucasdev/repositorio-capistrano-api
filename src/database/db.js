import mongoose from "mongoose"

const connectDatabase = () => {
    mongoose.connect("mongodb+srv://leiaadm:abcd1234@cluster0.15xdhdu.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }).then(() => console.log("MongoDB Atlas connected")).catch((error) => console.log(error))

}


export default connectDatabase
