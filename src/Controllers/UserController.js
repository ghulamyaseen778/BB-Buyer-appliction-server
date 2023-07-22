import jsonwebtoken from "jsonwebtoken";
import User from "../Models/UserSchema.js";
import { errHandler, responseHandler } from "../helper/response.js";

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
    .then((data) => {
      let {
        userName,
        Name,
        email,
        phoneNumber,
        password,
        profilePhoto,
        _id,
        createdAt,
      } = data;
      let token = jsonwebtoken.sign(
        {
          userName,
          Name,
          email,
          phoneNumber,
          password,
          profilePhoto,
          _id,
          createdAt,
        },
        process.env.SECRET_KEY
      );
      responseHandler(res, {
        userName,
        Name,
        email,
        phoneNumber,
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
  console.log(req.headers.authorization);
  let { email, password, userName } = req.body;
  if (password.trim().length < 8) {
    errHandler(res, 2, 403);
    return;
  }
  if (email) {
    User.findOne({ email, password })
      .then((data) => {
        let {
          userName,
          Name,
          email,
          phoneNumber,
          password,
          profilePhoto,
          _id,
          createdAt,
        } = data;
        let token = jsonwebtoken.sign(
          {
            userName,
            Name,
            email,
            phoneNumber,
            password,
            profilePhoto,
            _id,
            createdAt,
          },
          process.env.SECRET_KEY
        );

        responseHandler(res, {
          userName,
          Name,
          email,
          phoneNumber,
          password,
          profilePhoto,
          _id,
          createdAt,
          token,
        });
      })
      .catch((err) => {
        errHandler(res, 4, 409);
      });
  }
  if (userName) {
    User.findOne({ userName: userName.split(" ").join(""), password })
      .then((data) => {
        let {
          userName,
          Name,
          email,
          phoneNumber,
          password,
          profilePhoto,
          _id,
          createdAt,
        } = data;
        let token = jsonwebtoken.sign(
          {
            userName,
            Name,
            email,
            phoneNumber,
            password,
            profilePhoto,
            _id,
            createdAt,
          },
          process.env.SECRET_KEY
        );
        responseHandler(res, {
          userName,
          Name,
          email,
          phoneNumber,
          password,
          profilePhoto,
          _id,
          createdAt,
          token,
        });
      })
      .catch((err) => {
        errHandler(res, 7, 409);
      });
  }
};

const ProfileData = (req, res) => {
  const { userName, Name, email, phoneNumber, profilePhoto, _id, createdAt } =
    req.user;
  responseHandler(res, {
    userName,
    Name,
    email,
    phoneNumber,
    profilePhoto,
    _id,
    createdAt,
  });
};

const ProfileUpdate = (req, res) => {
  let body = req.body;
  const { _id } = req.user;
  if (!body.profilePhoto) {
    if (body.Name) {
      let profileName = body.Name.split(" ");
      if (profileName.length >= 2) {
        profileName = [profileName[0][0], profileName[1][0]]
          .join("")
          .toLocaleUpperCase();
      } else {
        profileName = profileName[0][0].toLocaleUpperCase();
      }
      console.log(profileName)
      body.profilePhoto= `https://placehold.co/100x100?text=${profileName}`;
    }
  }
  User.findByIdAndUpdate(_id, body, { new: true })
    .then((data) => {
      let {
        userName,
        Name,
        email,
        phoneNumber,
        password,
        profilePhoto,
        _id,
        createdAt,
      } = data;
      let token = jsonwebtoken.sign(
        {
          userName,
          Name,
          email,
          phoneNumber,
          password,
          profilePhoto,
          _id,
          createdAt,
        },
        process.env.SECRET_KEY
      );
      responseHandler(res, {
        userName,
        Name,
        email,
        phoneNumber,
        profilePhoto,
        createdAt,
        token,
      });
    })
    .catch((err) => {
      errHandler(res, 5, 409);
    });
};

export { RegisterdUser, LoginUser, ProfileData, ProfileUpdate };
