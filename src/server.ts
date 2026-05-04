import express, { Request, Response } from "express"
import config from "./config"
import initDB from "./config/db"
import { userRoutes } from "./user/user_Routes"
import { VehicleRouters } from "./vehicles/vehicle_routes"
import { bookingRoutes } from "./Bookings/bookingRoutes"



const app = express()
const port =config.port

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})
app.use(express.json());
initDB()

app.use("/api/v1/auth",userRoutes)
app.use("/api/v1/users",userRoutes)
app.use("/api/v1/vehicles",VehicleRouters)
app.use("/api/v1/bookings",bookingRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
