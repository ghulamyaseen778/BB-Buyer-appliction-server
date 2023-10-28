import express from "express";
import {
  LoginUser,
  ProfileData,
  ProfileUpdate,
  RegisterdUser,
  activeBrand,
  getBrand,
  otpVerify,
  updateBrand,
} from "../Controllers/UserController.js";
import { checkToken, upload } from "../middleware/index.js";
import { getProduct, productUpload } from "../Controllers/ProductController.js";
import { getOrder,createOrder, OrderComplete } from "../Controllers/OrderController.js";

const route = express.Router();

route.route("/registerd").post(RegisterdUser);
route.route("/login").post(LoginUser);
route.route("/verify").post(checkToken, otpVerify);
route
  .route("/brand")
  .post(checkToken, activeBrand)
  .get(getBrand)
  .put(updateBrand);
route
  .route("/profile")
  .get(checkToken, ProfileData)
  .put(checkToken, upload.single("image"), ProfileUpdate);
//products routers
route
  .route("/product")
  .post(checkToken, upload.any("images"), productUpload)
  .get(checkToken, getProduct);

route.get(checkToken,getOrder).post(checkToken,createOrder).put(checkToken,OrderComplete)

export default route;
