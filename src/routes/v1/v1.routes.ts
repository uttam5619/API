import express from "express"
import { SignIn,SignUp,SignOut } from "../../controllers/auth.controller.js"
import { IdempotentRequestMiddleware, IdempotentResponseMiddleware } from "../../middleware/idempotent_key.middleware.js"

export const v1Router = express.Router()

v1Router.get('/signin',SignIn)
v1Router.post('/signup',IdempotentRequestMiddleware, IdempotentResponseMiddleware,SignUp)
v1Router.post('/signout',SignOut)