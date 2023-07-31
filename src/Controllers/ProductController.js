import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Storage } from "../Config/firebase.config.js";
import { product, productDetail } from "../Models/productSchema.js";
import { responseHandler } from "../helper/response.js";
import { token } from "morgan";

const productUpload = async (req, res) => {
  const body =JSON.parse( req.body.product);
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
          console.log("success");
        await getDownloadURL(storageRef).then((url) => {
          arr.push(url)
        })
        }
      )
    }
  }

  productDetail.create(productDetails).then((Details)=>{
    product.create({...body,uesrToken:_id,productDetailsId:Details._id,images:arr}).then((response)=>{
      responseHandler(res,{product:response,productDetails:Details})
    })
  })
};

export { productUpload };