import  express  from "express"
import { userControllers } from "./user_Controllers";
import { authControllers } from "../modules/auth/auth_controllers";
import auth from "../middleware/auth";


const router=express.Router()


export const userRoutes=router;

router.post("/signup",userControllers.createUser)
router.post("/signin",authControllers.loginUser)

router.get("/",userControllers.getUser)
router.put("/:userId",auth("admin","user"),userControllers.updateUser)
router.delete("/:userId",auth("admin"),userControllers.deleteUser)
// router.post("/signin",)


