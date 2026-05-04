import { Request, Response } from "express";
import { pool } from "../../config/db";

import { authServices } from "./auth_Services";
import { JwtPayload } from "jsonwebtoken";

const loginUser=async(req:Request,res:Response)=>{
    const {email,password}=req.body
    const result=await authServices.loginUser(email,password)
    if(!result){
        res.status(401).json({
            success:false,
            message:"credintials failed"
        })
    }
    const {user,token}=result as JwtPayload;

    

    try{
        res.status(200).json({
            succeess:true,
            message:"Login Successfull",
            token:token,
            data:{
                id:user.id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                role:user.role
            


            }
        })
    }catch(error){
        res.status(401).json({
            success:false,
            message:"Login Failed"
        })
    }

}


export const authControllers={
    loginUser
}