import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Storage } from "../Config/firebase.config.js";
import { product, productDetail } from "../Models/productSchema.js";
import { errHandler, responseHandler } from "../helper/response.js";


const productUpload = async (req, res) => {
  const body =JSON.parse(req.body.product);
  const {_id} = req.user;
  const productDetails = JSON.parse(req.body.productDetails);
  let arr = []
  console.log(_id)
  if (req.files) {  
    let files = req.files
    console.log(files)
    let bool =false
    for (let i = 0; i < files.length; i++) {
      bool = false
      // console.log(i)
      const element = files[i];
      const metadata = {
        contentType: element?.mimetype,
      };
      const storageRef = ref(
        Storage,
        `uploads/${element?.fieldname + "_" + Date.now()}`
      );
      await uploadBytesResumable(storageRef, element?.buffer, metadata).then(
      async (snap) => {
        await getDownloadURL(storageRef).then((url) => {
          arr.push(url)
        })
        }
      ).catch((err)=>{
        errHandler(res,9,500)
      })
    }
  }
  else{
    errHandler(res,"images is required",500)
  }

  productDetail.create(productDetails).then((Details)=>{
    product.create({...body,uesrToken:_id,productDetailsId:Details._id,images:arr}).then((response)=>{
      responseHandler(res,{product:response,productDetails:Details})
    }).catch((err)=>{
      errHandler(res,8,500)
      console.log(err)
    })
  }).catch((err)=>{
    errHandler(res,8,500)
    console.log(err)
  })
};


const getProduct = (req,res)=>{
  let {myProducts,id,page,limit} = req.query
  const {_id} = req.user;
  page = Number(page||1)
  limit= Number(limit||6)
  const skip = (page-1)*limit
  console.log(_id)
  const obj = myProducts=="true"?{uesrToken:_id}:id?{_id:id}:{}
  product.find(obj).skip(skip).limit(limit).then( async(response)=>{
    responseHandler(res,{data:response,noOfHits:response.length})
  }).catch(()=>{
    errHandler(res,10,404)
  })
}

export { productUpload,getProduct };
