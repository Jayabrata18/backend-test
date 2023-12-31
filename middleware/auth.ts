import { Request, Response, NextFunction } from "express";
import catchAsyncError from "./catchAsynceErroe";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

//authenticated user
export const isAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;
    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
    }
    const decoded = jwt.verify(
      access_token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    if (!decoded) {
      return next(new ErrorHandler("access token is invalid", 401));
    }
    const user = await redis.get(decoded.id);
    if (!user) {
      return next(new ErrorHandler("user does not exist", 401));
    }
    req.user = JSON.parse(user);
    next();
  }
);
