import express from "express"
import { SignIn,SignUp,SignOut } from "../../controllers/auth.controller.js"

export const v1Router = express.Router()

v1Router.post('/signin',SignIn)
v1Router.post('/signup',SignUp)
v1Router.post('/signout',SignOut)