import { Request, Response } from "express";
import { bookingServices } from "./booking_services";
import { JwtPayload } from "jsonwebtoken";
import { vehicleControllers } from "../vehicles/vehicle_controllers";
import { vehicleServices } from "../vehicles/vehicle_services";

const createBookings = async (req: Request, res: Response) => {
  const result=await bookingServices.createBookings(req.body)

  const{Result,vehicle}=result  as JwtPayload




  try{
    res.status(200).json({
      success:true,
      message:"Booking created successfully",
      data:{
        id:Result.rows[0].id,
        customer_id:req.body.customer_id,
        vehicle_id:vehicle.rows[0].vehicle_id,
        rent_start_date:Result.rows[0].rent_start_date,
        rent_end_date:Result.rows[0].rent_end_date,
        total_price:Result.rows[0].total_price,
        status:Result.rows[0].status,
        vehicle:{
          vehicle_name:vehicle.rows[0].vehicle_name,
          daily_rent_price:vehicle.rows[0].daily_rent_price
        }
      },
     

    })
  }catch(error){
    res.status(401).json({
      success:false
    })
  }

}


const getBookings=async(req:Request,res:Response)=>{
  const{id,role}=req.user as JwtPayload

  if(role=="admin"){
     const result=await bookingServices.getBookings()
       try{
      res.status(200).json({
    success:true,
    message:"Bookings retrieved successfully",
    data:result.rows
  })
  }catch(error:any){
    res.status(401).json({
      success:false,
      message:error.message

    })

  }
     

  }
  else if(role=="customer"){
    const result=await bookingServices.getBookingsById(id)
    console.log(req.user)

           try{
      res.status(200).json({
    success:true,
    message:"Bookings retrieved successfully",
    data:result.rows[0]
  })
  }catch(error:any){
    res.status(401).json({
      success:false,
      message:error.message

    })

  }

  }

  
}

const updateBookings=async(req:Request,res:Response)=>{
  const {role,id}=req.user as JwtPayload



    if(req.body.status=="returned" && role=="customer"){
      return res.status(400).json({
        success:true,
        message:"Only Admin can return"
      })
    }

    if(req.body.status=="cancelled" && (role=="customer"||role=="admin")){

          try{
      const result=await bookingServices.updateBookings(req.params.bookingId as string,req.body.status)
      console.log(req.params.bookingId)
      res.status(200).json({
        success:true,
        message:"Booking has been succesfully Cancelled",
        data:result
      })

    }catch(error:any){
      res.status(400).json({
        success:false,
        message:error.message
      })
    }
    }
    
    if(req.body.status=="returned" && role=="admin" ){
        try{
      const result=await bookingServices.ReturnStatus(req.params.bookingId as string,req.body.status)
      console.log(req.params.bookingId)
      res.status(200).json({
        success:true,
        message:"Booking has been succesfully Returned",
        data:{
          id:result?.result.rows[0].id,
          customer_id: result?.result.rows[0].customer_id,
          vehicle_id: result?.result.rows[0].vehicle_id,
          rent_start_date: result?.result.rows[0].rent_start_date,
           rent_end_date: result?.result.rows[0].rent_end_date,
          total_price: result?.result.rows[0].total_price,
          status: result?.result.rows[0].status,
          vehicle:{
            availability_status:"available"
          }
        }
      })

    }catch(error:any){
      res.status(400).json({
        success:false,
        message:error.message
      })
    }

  }








}



export const bookingContollers={
    createBookings,getBookings,updateBookings
}