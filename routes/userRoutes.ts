import express from "express";
import { registrationUser } from "../controllers/userController";
const userRouter = express.Router();

userRouter.post("/registration", registrationUser);

export default userRouter;