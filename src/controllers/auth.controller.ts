import type { Request,Response,} from "express";
import { SignUpService } from "../service/authService.js";


export async function SignUp(req:Request,res:Response){
    try{
        const data =req.body
        const newUser = SignUpService(data)
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

    }catch(err){
        
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