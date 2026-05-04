import { pool } from "../config/db"

const createBookings=async(payload: Record<string,unknown>)=>{
 
    const{customer_id,vehicle_id,rent_start_date,rent_end_date}=payload

    const user=await pool.query(`SELECT * FROM users WHERE id=$1`,[customer_id])

    if(user.rows.length===0){
        return null
    }

    const vehicle=await pool.query(`SELECT * FROM vehicles WHERE id=$1`,[vehicle_id])
    
    if(vehicle.rows.length===0){
        return null
    }

    const availability_status:string=vehicle.rows[0].availability_status

    if(availability_status=="booked"){
        return null
    }

    const totalDays:number=(new Date(rent_end_date as string).getTime()-new Date(rent_start_date as string).getTime())/(1000*60*60*24)

    const total_price=parseFloat(vehicle.rows[0].daily_rent_price)*totalDays

    const Result=await pool.query(`INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,[customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,"active"])

    const update_availability_status=await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,["booked",vehicle_id])




    return {Result,vehicle}





}

const getBookings=async()=>{
    const result=await pool.query(`SELECT * FROM vehicles`)

    return result
}

const getBookingsById=async(id:string)=>{
    const result = await pool.query(
  `SELECT * FROM bookings WHERE customer_id= $1`,
  [id]
)

    return result
}

const updateBookings=async(id:string,status:string)=>{

    const booking=await pool.query(`SELECT * FROM bookings WHERE id= $1`,[id])
    if(booking.rows.length===0){
        return "Booking Not Found"
    }
    
    const result=await pool.query('UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *',[status,id])

    return result.rows[0]
  


}

const ReturnStatus=async(id:string,status:string)=>{

    const booking=await pool.query(`SELECT * FROM bookings WHERE id= $1`,[id])

    if(booking.rows[0].status==="available"){
        return null
    }
    const result=await pool.query('UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *',[status,id])

    const vehicleId=booking.rows[0].vehicle_id

    
    const updateVehicleStatus=await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`,['available',vehicleId])

    return{result,updateVehicleStatus}



}




export const bookingServices={
    createBookings,getBookings,getBookingsById,updateBookings,ReturnStatus
}