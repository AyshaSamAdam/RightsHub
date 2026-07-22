import  express from "express";
import getResourcesController from '../controllers/resource.controller'
import protect from "../middleware/auth.middleware";


const resourceRouter= express.Router()


resourceRouter.get("/", protect,  getResourcesController)

export default resourceRouter  



    