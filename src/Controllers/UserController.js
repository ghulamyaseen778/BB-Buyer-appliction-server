import jsonwebtoken from "jsonwebtoken";
import User from "../Models/UserSchema.js";
import { errHandler, responseHandler } from "../helper/response.js";

const RegisterdUser = async (req, res) => {
  let { Name, email, password, profilePhoto } = req.body;

  if (User && (await User.findOne({ email }))) {
    errHandler(res, 1, 403);
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
    email,
    password,
    profilePhoto: profilePhoto + profileName,
  })
    .then((data) => {
      let { name, email, password, profilePhoto, _id, createdAt,token } = data;

      responseHandler(res, {
        name,
        email,
        password,
        profilePhoto,
        _id,
        createdAt,
        token,
      });
    })
    .catch((err) => {
      errHandler(res, 5, 409);
    });
};

const LoginUser = (req, res) => {
  let { email, password } = req.body;
  if (password.trim().length < 8) {
    errHandler(res, 2, 403);
    return;
  }
  User.findOne({ email })
    .then((data) => {
      let { name, email, password, profilePhoto, _id, createdAt } = data;
      let token = jsonwebtoken.sign(
        { name, email, password, profilePhoto, _id, createdAt },
        process.env.SECRET_KEY
      );
      responseHandler(res, {
        name,
        email,
        password,
        profilePhoto,
        _id,
        createdAt,
        token,
      });
    })
    .catch((err) => {
      errHandler(res, 5, 409);
    });
};

export { RegisterdUser, LoginUser };
