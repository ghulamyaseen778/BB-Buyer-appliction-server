import express from "express"
import { LoginUser, ProfileData, ProfileUpdate, RegisterdUser } from "../Controllers/UserController.js"
import { checkToken, upload } from "../middleware/index.js"

const route = express.Router()

route.route("/registerd").post(RegisterdUser)
route.route("/login").post(LoginUser)
route.route("/profile").get(checkToken,ProfileData).put(checkToken,upload.single("image"),ProfileUpdate)

export default route