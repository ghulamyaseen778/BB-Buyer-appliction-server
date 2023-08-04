import jsonwebtoken from "jsonwebtoken";
import {User,otpVerification} from "../Models/UserSchema.js";
import { errHandler, responseHandler } from "../helper/response.js";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Storage } from "../Config/firebase.config.js";
import asyncHandler from "express-async-handler";
import MailTransporter from "../Config/mail.js"


const otpGenrater = (data) =>{
  const otp = Math.floor(1000+Math.random()*9000)
      otpVerification.create({UserId:data._id,otp}).then((datas)=>{
        console.log(datas)
        MailTransporter(data,datas)
      })
}

const tokenGenrater = (dataObj) => {
  let {
    userName,
    Name,
    email,
    phoneNumber,
    password,
    profilePhoto,
    _id,
    isAdmin,
    verified,
    createdAt,
  } = dataObj;
  let token = jsonwebtoken.sign(
    {
      userName,
      Name,
      email,
      phoneNumber,
      password,
      profilePhoto,
      _id,
      isAdmin,
    verified,
      createdAt,
    },
    process.env.SECRET_KEY
  );

  return {
    userName,
    Name,
    email,
    phoneNumber,
    password,
    profilePhoto,
    _id,
    isAdmin,
    verified,
    createdAt,
    token,
  };
};

const RegisterdUser = async (req, res) => {
  let { Name, email, password, userName, phoneNumber } = req.body;
  let profilePhoto = "https://placehold.co/100x100?text=";

  if (User && (await User.findOne({ email }))) {
    errHandler(res, 1, 403);
    return;
  } else if (
    User &&
    (await User.findOne({ userName: userName.split(" ").join("") }))
  ) {
    errHandler(res, 6, 403);
    return;
  } else if (password?.trim().length < 8) {
    errHandler(res, 2, 403);
    return;
  } else if (Name?.trim().length < 3) {
    errHandler(res, 3, 403);
    return;
  }

  let profileName = Name.split(" ");
  if (profileName.length >= 2) {
    profileName = [profileName[0][0], profileName[1][0]]
      .join("")
      .toLocaleUpperCase();
  } else {
    profileName = profileName[0][0].toLocaleUpperCase();
  }

  User.create({
    Name,
    userName: userName.split(" ").join(""),
    email,
    phoneNumber,
    password,
    profilePhoto: profilePhoto + profileName,
  })
    .then(async(data) => {
      let dataObj = tokenGenrater(data);
      responseHandler(res, dataObj);
      otpGenrater(data)
    })
    .catch((err) => {
      errHandler(res, 5, 409);
    });
};

const LoginUser = (req, res) => {
  console.log(req.body);
  let { email, password, userName } = req.body;
  if (password.trim().length < 8) {
    errHandler(res, 2, 403);
    return;
  }
  if (email) {
    User.findOne({ email, password })
      .then(async(data) => {
        if (!data.verified) {
          let dataObj = tokenGenrater(data);
          responseHandler(res, dataObj);
          await otpVerification.deleteOne({UserId:data._id})
          otpGenrater(data)
        }
        else{
          let dataObj = tokenGenrater(data);
          responseHandler(res, dataObj);
        }
      })
      .catch((err) => {
        errHandler(res, 4, 409);
      });
      return
  }
  if (userName) {
    User.findOne({ userName: userName.split(" ").join(""), password })
      .then(async(data) => {
        if (!data.verified) {
          let dataObj = tokenGenrater(data);
          responseHandler(res, dataObj);
          await otpVerification.deleteOne({UserId:data._id})
          otpGenrater(data)
        }
        else{
          let dataObj = tokenGenrater(data);
          responseHandler(res, dataObj);
        }
      })
      .catch((err) => {
        errHandler(res, 7, 409);
      });
  }
};

const ProfileData = (req, res) => {
  const {
    userName,
    Name,
    email,
    phoneNumber,
    profilePhoto,
    _id,
    createdAt,
    password,
    isAdmin,
    verified,
  } = req.user;
  responseHandler(res, {
    userName,
    Name,
    email,
    phoneNumber,
    profilePhoto,
    password,
    _id,
    createdAt,
    isAdmin,
    verified,
  });
};

const ProfileUpdate = asyncHandler(async (req, res) => {
  console.log(req.file);
  let body = req.body;
  const { _id } = req.user;
  const ResponseSend = () => {
    User.findByIdAndUpdate(_id, body, { new: true })
      .then((data) => {
        let dataObj = tokenGenrater(data);
        responseHandler(res, dataObj);
      })
      .catch((err) => {
        errHandler(res, 5, 409);
      });
  };
  if (req.file) {
    const metadata = {
      contentType: req.file.mimetype,
    };

    const storageRef = ref(
      Storage,
      `uploads/${req.file.fieldname + "_" + Date.now()}`
    );
    console.log(storageRef);
    //     const bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
    await uploadBytesResumable(storageRef, req.file.buffer, metadata).then(
      (snap) => {
        console.log("success");
        getDownloadURL(storageRef).then((url) => {
          body.profilePhoto = url;
          console.log(url, "url");
          ResponseSend();
        });
      }
    );
  } else if (body.Name) {
    let profileName = body.Name.split(" ");
    if (profileName.length >= 2) {
      profileName = [profileName[0][0], profileName[1][0]]
        .join("")
        .toLocaleUpperCase();
    } else {
      profileName = profileName[0][0].toLocaleUpperCase();
    }
    console.log(profileName);
    body.profilePhoto = `https://placehold.co/100x100?text=${profileName}`;
    ResponseSend();
  } else {
    ResponseSend();
  }
});

const otpVerify = async (req,res)=>{
  const { _id } = req.user;
  const {otp} = req.body
  otpVerification.findOne({UserId:_id}).then(async(data)=>{ 
    console.log(data)
    if (otp) {
      if(data.expireAt < Date.now()){
        errHandler(res,11,500)
        await otpVerification.deleteOne({UserId:_id})
      }else{
        if(data.otp==otp){
          await otpVerification.deleteOne({UserId:_id})
          User.findByIdAndUpdate(_id,{verified:true},{ new: true })
          .then(async(data) => {
            let dataObj = tokenGenrater(data);
            await otpVerification.deleteOne({UserId:_id})
            responseHandler(res, dataObj);
          })
          .catch((err) => {
            errHandler(res, 5, 409);
          });
        }else{
          errHandler(res,"invaild otp",404)
        }
      }
    }else{
      errHandler(res,"please enter otp",404)
    }
  }).catch(()=>{
    errHandler(res,"invaild otp",404)
  })
}

export { RegisterdUser, LoginUser, ProfileData, ProfileUpdate,otpVerify };
