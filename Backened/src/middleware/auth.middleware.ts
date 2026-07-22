declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string
            }
        }
    }
}


import { Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis";
import jwt from 'jsonwebtoken'






async function protect(req: Request, res: Response, next: NextFunction) {

    try {
          
        const accessToken = req.headers.authorization?.split(" ")[1]
      

        if (!accessToken) {
            return res.status(401).json({
                message: 'No Token Not authorized !'
            })
        }



        const tokenInRedis = await redisClient.get(`rightshub:accessToken:${accessToken}`)

        if (!tokenInRedis) {
            return res.status(401).json({
                message: 'Session expired Please Login'

            })
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_ACESS_KEY as string) as { id: string }
        req.user = decoded
        next()

    }

    catch (error:any) {
        
        return res.status(401).json({
            message: 'Not Authorized '
        })
    }

}


export default protect