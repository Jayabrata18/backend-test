import { Response } from "express";
import CourseModel from "../models/courseModel";
import catchAsyncError from "../middleware/catchAsynceErroe";

//create course
export const createCourse = catchAsyncError(
  async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  }
);
