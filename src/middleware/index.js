import jwt from 'jsonwebtoken'
import { errHandler } from '../helper/response.js'
import User from '../Models/UserSchema.js'

const checkToken = async (req,res,next)=>{
   let token = req.headers.authorization
   if(token){
  try{
    token = token.split(" ")[1]
    token = jwt.verify(token,process.env.SECRET_KEY)
    req.user = await User.findById({_id:token._id})
    next()
  }catch(err){
    errHandler(res,"Unautorized User",404)
  }
   }else{
    errHandler(res,"Unautorized User",404)
   }
}

export {checkToken}