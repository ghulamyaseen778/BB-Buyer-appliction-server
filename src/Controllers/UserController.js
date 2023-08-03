import jsonwebtoken from "jsonwebtoken";
import User from "../Models/UserSchema.js";
import { errHandler, responseHandler } from "../helper/response.js";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Storage } from "../Config/firebase.config.js";
import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config()

const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.SERVICE,
    pass: process.env.PASS
  }
});

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
      const otp = Math.floor(1000+Math.random()*9000)
      transporter.sendMail({
        from: process.env.SERVICE, // sender address
        to: process.env.SERVICE, // list of receivers
        subject: "Verification code from BB Buyer", // Subject line
        html: `<body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
        <table role="presentation"
          style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
          <tbody>
            <tr>
              <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                  <tbody>
                    <tr>
                      <td style="padding: 40px 0px 0px;">
                        <div style="text-align: left;">
                          <div style="padding-bottom: 20px;"><div style="border-bottom:1px solid #eee">
                          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">BB Buyer</a>
                        </div></div>
                        </div>
                        <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                          <div style="color: rgb(0, 0, 0); text-align: left;">
                            <h1 style="margin: 1rem 0">Verification code</h1>
                            <p style="padding-bottom: 16px">Thank you for choosing BB Buyer Brand. Use the following OTP to complete your Registration procedures. OTP is valid for 5 minutes</p>
                            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">BB-${otp}</h2>
                            <p style="padding-bottom: 16px">If you didn’t request this, you can ignore this email.</p>
                            <p style="padding-bottom: 16px">Thanks,<br>The BB Buyer team</p>
                          </div>
                        </div>
                        
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>`, // html body
      },(_,info)=>{
          console.log("Message sent: %s", info);
      });
    })
    .catch((err) => {
      errHandler(res, 5, 409);
    });
};

const LoginUser = (req, res) => {
  console.log(req.headers.authorization);
  let { email, password, userName } = req.body;
  if (password.trim().length < 8) {
    errHandler(res, 2, 403);
    return;
  }
  if (email) {
    User.findOne({ email, password })
      .then((data) => {
        let dataObj = tokenGenrater(data);
        responseHandler(res, dataObj);
      })
      .catch((err) => {
        errHandler(res, 4, 409);
      });
  }
  if (userName) {
    User.findOne({ userName: userName.split(" ").join(""), password })
      .then((data) => {
        let dataObj = tokenGenrater(data);
        responseHandler(res, dataObj);
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

export { RegisterdUser, LoginUser, ProfileData, ProfileUpdate };
