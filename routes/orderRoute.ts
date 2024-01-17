import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { createOrder } from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.put("/create-order", isAuthenticated, createOrder);
export default orderRouter;
