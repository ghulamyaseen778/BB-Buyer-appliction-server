import express from "express";
import {
  LoginUser,
  ProfileData,
  ProfileUpdate,
  RegisterdUser,
} from "../Controllers/UserController.js";
import { checkToken, upload } from "../middleware/index.js";
import { getProduct, productUpload } from "../Controllers/ProductController.js";

const route = express.Router();

route.route("/registerd").post(RegisterdUser);
route.route("/login").post(LoginUser);
route
  .route("/profile")
  .get(checkToken, ProfileData)
  .put(checkToken, upload.single("image"), ProfileUpdate);
//products routers

route
  .route("/product")
  .post(checkToken, upload.any("images"), productUpload)
  .get(checkToken,getProduct);

export default route;
