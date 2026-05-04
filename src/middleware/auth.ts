import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth=(...roles:string[])=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const token=req.headers.authorization
        if(!token){
            return res.status(401).json({
          success: false,
          message: "No token provided",
        });
        }
        const decoded=jwt.verify(token,config.jwtSecret as string) as JwtPayload

        req.user=decoded
        
        if(roles.length && !roles.includes(decoded.role as string)){
            return res.status(500).json({
                error:"unauthorized!!"
            })

        }
        next()



    }
}


export default auth;