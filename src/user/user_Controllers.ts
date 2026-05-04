import { Request, Response } from "express";
import { userServices } from "./user_Services";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import config from "../config";



const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "Data Inserted Successfully",
      data: result.rows[0]
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getUser=async(req:Request,res:Response)=>{
  const result=await userServices.getUsers()
  try{
    res.status(200).json({
      success:true,
      message:"Users retrieved successfully",
      data:result.rows
    })
  }catch(error:any){
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}


const updateUser=async(req:Request,res:Response)=>{

  const{id,role}=req.user as JwtPayload

  if(role=="admin"){
    try{
      const result =await userServices.updateUser(req.body,req.params.userId as string)

      return res.status(200).json({
        success:true,
        message:"User updated successfully",
        data:result.rows[0]
      })
    }catch(error:any){
      return res.status(401).json({
        success:false,
        message:error.message
      })
    }
  }

  if(role=="customer"){
    if(Number(req.params.userId)===Number(id)){
      try{
        const result =await userServices.updateUser(req.body,req.params.userId as string)

        return res.status(200).json({
          success:true,
          message:"User updated successfully",
          data:result.rows[0]
        })
      }catch(error:any){
        return res.status(401).json({
          success:false,
          message:error.message
        })
      }
    }
  }


  return res.status(403).json({
    success:false,
    message:"Unauthorized"
  })
}

const deleteUser=async(req:Request,res:Response)=>{
    const result=await userServices.deleteUser(req.params.userId as string)
    


    try{
        res.status(200).json(
            {
                success:true,
                message:"done"
            }
        )
    }catch(error){
        res.status(401).json({
            success:false
        })
    }


}




export const userControllers={
    createUser,getUser,updateUser,deleteUser
}