import express from "express"
import { bookingContollers } from "./booking_controllers"
import auth from "../middleware/auth"

const router=express.Router()

export const bookingRoutes=router

router.post("/",bookingContollers.createBookings)
router.get("/",auth("admin", "customer"),bookingContollers.getBookings)
router.put("/:bookingId",auth("customer","admin"),bookingContollers.updateBookings)