import { NextFunction, Request, Response } from "express";
import userModel, { IUser } from "../models/userModel";
import ErrorHandler from "../utils/ErrorHandler";
import catchAsyncError from "../middleware/catchAsynceErroe";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";

require("dotenv").config();

//register user

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  // avatar?: string;
}
export const registrationUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const isEmailExist = await userModel.findOne({ email: email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }
      const user: IRegistrationBody = {
        name,
        email,
        password,
      };
      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activationMail.ejs"),
        data
      );
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activationMail.ejs",
          data,
        });
        res.status(200).json({
          sucess: true,
          message: `Please check your email: ${user.email} to activate your account!`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
interface IActivationToken {
  token: string;
  activationCode: string;
}
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.JWT_PRIVATE_KEY as Secret,
    {
      expiresIn: "5min",
    }
  );
  return { token, activationCode };
};
//activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}
export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.JWT_PRIVATE_KEY as string
      ) as { user: IUser; activationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
      const { name, email, password } = newUser.user;
      // const existUser = await userModel.findOne({ email: email });
      // if (existUser) {
      //   return next(new ErrorHandler("User already exists", 400));
      // }
      const user = await userModel.create({ name, email, password });
      res
        .status(201)
        .json({ success: true, message: "Account has been activated" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

////////////////////////////////
//login user

interface ILoginRequest {
  email: string;
  password: string;
}
export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;
      const user = await userModel
        .findOne({ email: email })
        .select("+password");
      if (!email || !password) {
        return next(new ErrorHandler("Please enter email & password", 400));
      }
      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }
      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//logout user
export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", {
        maxAge: 1,
        // expires: new Date(Date.now()),
        // httpOnly: true,
      });
      res.cookie("refresh_token", "", {
        maxAge: 1,
        // expires: new Date(Date.now()),
        // httpOnly: true,
      });
      const userId = req.user?._id || "";
      redis.del(userId);
      res
        .status(200)
        .json({ success: true, message: "Logged out Sucessfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
