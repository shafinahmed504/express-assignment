import express, { Request, Response } from "express"
import { vehicleServices } from "./vehicle_services"
import { json } from "stream/consumers"
import { JwtPayload } from "jsonwebtoken"

const createVehicle=async(req:Request,res:Response)=>{
    const result=await vehicleServices.createVehicle(req.body)
    const{role}=req.user as JwtPayload
    if(role=="admin"){
            const{id,vehicle_name,type,registration_number,daily_rent_price,availability_status}=result.rows[0]

    try{
        res.status(201).json({
            success:true,
            data:{
                id:id,
                vehicle_name:vehicle_name,
                type:type,
                registration_number:registration_number,
                daily_rent_price:daily_rent_price,
                availability_status:availability_status
            }
        })

    
    
    }catch(error){
        res.status(401).json({
            success:false,
            message:"failed"
        })
    }

    }



}

const getVehicles=async(req:Request,res:Response)=>{
    const result=await vehicleServices.getVehicles()
    try{
        res.status(200).json({
            success:true,
            message:"Vehciles fetched Successfully",
            data:result.rows
        })
    }catch(error:any){
        res.status(401).json({
            success:false,
            message:error.message
        })
    }
}

const getVehicleById=async(req:Request,res:Response)=>{
         
        const result=await vehicleServices.getVehicleById(req.params.vehicleId as string)

        if(result.rows.length===0){
          return  res.status(401).json({
            success:false,
            message:"Vehicle not found"
        })
        }
    try{
        res.status(200).json({
            success:true,
            message:"Vehcile fetched Successfully",
            data:result.rows
        })
    }catch(error:any){
        res.status(401).json({
            success:false,
            message:error.message
        })
    }


}

const updateVehicle=async(req:Request,res:Response)=>{

    const{role}=req.user as JwtPayload

    if(role=="admin"){
            const{vehicle_name,type,registration_number,daily_rent_price,availability_status}=req.body
   
    
    const result= await vehicleServices.updateVehicle(vehicle_name,type,registration_number,daily_rent_price,availability_status,req.params.id as string)

    if(result.rows.length===0){
        return res.status(400).json({
            success:false,
            message:"user Not found"
        })
    }

    try{
        res.status(200).json({
            success:true,
            message:"updated SSucessfully",
            data:result.rows[0]
        })
    }catch(error){
        res.status(401).json({
            success:true,
            message:"Error"
        })
    }

    }



}

const deleteVehicle=async(req:Request,res:Response)=>{

    const {role}=req.user as JwtPayload
    const result=await vehicleServices.deleteVehicle(req.params.id as string)

    if(role=="admin"){
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





}

export const vehicleControllers={
    createVehicle,getVehicles,getVehicleById,updateVehicle,deleteVehicle
}