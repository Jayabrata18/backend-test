import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { uploadCourse } from "../controllers/courseController";
const CourseRouter = express.Router();

CourseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);
export default CourseRouter;
