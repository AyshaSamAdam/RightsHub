import 'dotenv/config';

const requiredEnvVars = [
   'PORT',
   'MONGO_URI',
   'REDIS_URL',
   'SALT_ROUNDS',
   'JWT_SECRET_ACESS_KEY',
   'JWT_SECRET_REFRESH_KEY',
   'NODE_ENV',
   'RESEND_API_KEY',
   'FRONTEND_URL',
   'GOOGLE_CLIENT_ID',
   'GOOGLE_CLIENT_SECRET',
   'GOOGLE_REDIRECT_URI',
   'ANTHROPIC_API_KEY'
]

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`MISSING REQUIRED ENV VAR: ${varName}`)
        process.exit(1)
    }
})


import app from './app'

import connectDB from './config/database'
import { connectRedis } from './config/redis';



connectDB()
connectRedis()

app.listen(process.env.PORT || 8000, () => {
    console.log(`server is running on port ${process.env.PORT}`)
})
