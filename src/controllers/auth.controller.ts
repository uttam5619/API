import type { Request,Response,} from "express";
import { SignUpService } from "../service/authService.js";
import { ServerError } from "../utils/Error.js";


export async function SignUp(req:Request,res:Response){
    try{
        const data =req.body
        const newUser = await SignUpService(data)
        return res.status(201).json(
            {
                sucess:true,
                message:'User created sucesssfully',
                userData:newUser
            }
        )
    }catch(err){
        console.log(err)
    }
}


export async function SignIn(req:Request,res:Response){
    try{
        res.status(200).json(
            {
                sucess:'true',
                message:'signup route working properly'
            }
        )
    }catch(err){
        console.log(err)
    }
}


export async function SignOut(req:Request,res:Response){
    try{

    }catch(err){
        
    }
}


export function ForgetPassword(req:Request, res:Response){
    try{

    }catch(err){

    }
}


export function ResetPassword(req:Request, res:Response){
    try{

    }catch(err){

    }
}