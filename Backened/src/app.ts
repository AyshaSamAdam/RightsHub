import express from 'express'
import cors from 'cors'
import helmet from 'helmet' 
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes'
import resourceRouter from './routes/resources.routes'
import situationRouter from './routes/situation.routes'


const app = express()

//  MIDDLEWARES 
app.use(helmet())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(cookieParser())

//

app.use("/api/auth", authRouter)
app.use("/api/resources", resourceRouter)
app.use("/api/situations", situationRouter)

app.get("/health", (req, res) => {
     res.status(200).json({status : "ok"})
})


export default app