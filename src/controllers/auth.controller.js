import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/ApiError.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

export const refreshAccessToken = async (req, res, next) => {
  const incomingRefreshToken =
    req.body.refreshToken || req.cookies.refresh_token;

  if (!incomingRefreshToken) {
    return next(createError(401, "You are not authenticated!"));
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?.id);

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    if (user.refreshToken !== incomingRefreshToken) {
      return next(createError(403, "Refresh token is not valid!"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("access_token", accessToken, {
        options,
      })
      .cookie("refresh_token", refreshToken, {
        options,
      })
      .json({ accessToken, refreshToken });
  } catch (err) {
    return next(createError(403, "Refresh token is not valid!"));
  }
};

export const signup = async (req, res, next) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email

  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res
  try {
    const { email, name, password } = req.body

    if(
      [
        email,
        name,
        password
      ].some((field) => field?.trim() === "")
    ){
      return next(createError(400, "All fields are required!"))
    }

    const existedUser = await User.findOne({
      $or: [{ name }, { email }]
  })

    if(existedUser){
      return next(createError(400, "User already exists!"))
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    if(!createdUser){
      return next(createError(400, "User not created!"))
    }

    return res.status(201).json(createdUser, {
      message: "User created successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie
  try {
    const { email, name } = req.body;

    if (!email && !name)
      return next(createError(400, "Please provide email or username!"));

    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

    // access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("access_token", accessToken, options)
      .cookie("refresh_token", refreshToken, options)
      .json(loggedInUser);

    // const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);
    // const { password, ...others } = user._doc;

    // res
    //   .cookie("access_token", token, {
    //     httpOnly: true,
    //   })
    //   .status(200)
    //   .json(others);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  // Step 1: Find the user by their ID and update the document to unset the refreshToken field
  // Step 2: Define options for clearing cookies
  // Step 3: Return a response indicating successful logout

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("access_token", options)
    .cookie("refresh_token", options)
    .json({ message: "Logged out successfully" });
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign(
        { id: savedUser._id },
        process.env.ACCESS_TOKEN_SECRET
      );
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};
