import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
  UserId: {
    type: String,
    required: true,
  },
  Products: {
    type: Array,
    required: true, // add sizes,quntity,color,product id, seller id, product rating, brand rating needed. [[productsData],[productrating],[brandRating]]
  },
  isConfirmedByAdmin:{
    type: String,
    required: true,
  },
  orderType:{
    type:String,
    required:true,
    enum:["cod"]
  },
  location:{
    type:String,
    required:true,
  },
  orderDeliver:{
    type:Boolean,
    default:false
  },
  isCustomer:{
    type:Boolean,
    default:false
  }
});

const Order = mongoose.model("OrderProduct", OrderSchema);
export { Order };
