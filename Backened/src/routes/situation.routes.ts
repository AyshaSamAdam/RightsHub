import express from 'express'

import {situationController, getUserSituationController} from '../controllers/situation.controller'
import protect from '../middleware/auth.middleware'

const situationRouter = express.Router()



situationRouter.post("/",  protect ,situationController)
situationRouter.get("/get", protect, getUserSituationController )



export default  situationRouter 