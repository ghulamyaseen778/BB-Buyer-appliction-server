import { Order } from "../Models/OrderSchema.js"
import { errHandler, responseHandler } from "../helper/response.js"

const getOrder = (req,res) =>{
    Order.find({}).then((data)=>{
      responseHandler(res,data)
    }).catch(()=>{
      errHandler(res,"Not get orders",404)
    })
}

const createOrder = (req,res) =>{
  const body = req.body
  const {_id} = req.user;
  Order.create({UserId:_id,...body}).then((data)=>{
    responseHandler(res,data)
  }).catch(()=>{
    errHandler(res,5,403)
  })
}

const OrderComplete =(req,res) =>{
  const {_id} = req.user;
  const {orderDeliver,orderId} = req.body
    Order.findByIdAndUpdate({_id:orderId},{orderDeliver}).then((data)=>{
      responseHandler(res,data)
    }).catch(()=>{
      errHandler(res,10,404)
    })

}

export {getOrder,createOrder,OrderComplete}