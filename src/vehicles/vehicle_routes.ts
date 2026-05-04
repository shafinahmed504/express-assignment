import express from "express"
import { vehicleControllers } from "./vehicle_controllers"
import auth from "../middleware/auth"

const router=express.Router()

export const VehicleRouters=router


router.post("/",auth("admin"),vehicleControllers.createVehicle)
router.get("/",vehicleControllers.getVehicles)
router.get("/:vehicleId",vehicleControllers.getVehicleById)
router.put("/:id",auth("admin"),vehicleControllers.updateVehicle)
router.delete("/:id",auth("admin"),vehicleControllers.deleteVehicle)


