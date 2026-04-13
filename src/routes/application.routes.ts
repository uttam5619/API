import express from "express"
import { v1Router } from "./v1/v1.routes.js"

const applicationRouter = express.Router()

applicationRouter.use('/v1/auth',v1Router)

export default applicationRouter