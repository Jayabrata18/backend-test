import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/courseController";
const CourseRouter = express.Router();

CourseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);
CourseRouter.put(
  "/update-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);
CourseRouter.get("/get-course/:id", getSingleCourse);
CourseRouter.get("/get-course/", getAllCourses);
CourseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser);
CourseRouter.put("/add-question", isAuthenticated, addQuestion);
CourseRouter.put("/add-answer", isAuthenticated, addAnswer);
CourseRouter.put("/add-review/:id", isAuthenticated, addReview);
CourseRouter.put(
  "/add-reply",
  isAuthenticated,
  authorizeRoles("admin"),
  addReplyToReview
);
export default CourseRouter;
