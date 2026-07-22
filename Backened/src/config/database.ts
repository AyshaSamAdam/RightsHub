import mongoose  from "mongoose";


async function connectDB () {

    try{
        const mongoUri = process.env.MONGO_URI

        if(!mongoUri) {
            throw new Error ("MONGO_URI is not defined in .env file")
        }
        await mongoose.connect(mongoUri)
        console.log("connected To DB")

    }
          catch(error : unknown) {
            console.log(`Eror while connecting to database ${error}`)
            process.exit(1)

    }
}

export default connectDB