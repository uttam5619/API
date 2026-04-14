import type { Request, Response, NextFunction } from "express";

export function ValidateSignUpRequestBody(req:Request,res:Response,next:NextFunction){
    try{
        next()

        const {name, email, password}=req.body
        if(!name){
            return res.status(400).json(
                {
                    sucess:false,
                    message:`name is missing`
                }
            )
        }else if(!email){
            return res.status(400).json(
                {
                    sucess:false,
                    message:`email is missing`
                }
            ) 
        }else if(!password){
            return res.status(400).json(
                {
                    sucess:false,
                    message:`password is missing`
                }
            )
        }

        const regex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const userEmail = email.trim()
        if(!regex.test(userEmail)){
            return res.status(400).json(
                {
                    sucess:false,
                    message:`email is not appropriate`
                }
            )
        }
    }catch(err){
        console.log(err)
    }
}