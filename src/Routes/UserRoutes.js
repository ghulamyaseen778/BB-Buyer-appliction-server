import express from "express"
import { LoginUser, RegisterdUser } from "../Controllers/UserController.js"

const route = express.Router()

route.route("/registerd").post(RegisterdUser)
route.route("/login").post(LoginUser)

export default route