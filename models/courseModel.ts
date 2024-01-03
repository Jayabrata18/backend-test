import mongoose, { Model, Schema } from "mongoose";
import { Document } from "mongoose";

interface IComment extends Document {
  user: string;
  comment: string;
  // rating: number;
  commentReply: IComment[];
}

interface IReview extends Document {
  user: string;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}
interface ILink extends Document {
  title: string;
  url: string;
}
interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSections: string;
  videoLength: number;
  videoPlayer: string;
  link: ILink[];
  suggestion: string;
  questions: IComment[];
}
interface ICourse extends Document {
  name: string;
  description: string;
  price: number;
  estimatedprice?: number;
  thumbnail: object;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased: number;
}
const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: "number",
    default: 0,
  },
  comment: String,
});
const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
});

const commentSchema = new Schema<IComment>({
  user: Object,
  comment: String,
  commentReply: [Object],
});
const courseDataSchema = new Schema<ICourseData>({
  videoUrl: String,
  title: String,
  videoSections: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  link: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
});

const courseSchema = new Schema<ICourse>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  estimatedprice: {
    type: Number,
  },
  thumbnail: {
    public_id: {
      type: String,
    },
    url: {
      required: true,
      type: String,
    },
  },
  tags: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  demoUrl: {
    type: String,
    required: true,
  },
  benefits: [{ title: String }],
  prerequisites: [{ title: String }],
  reviews: [reviewSchema],
  courseData: [courseDataSchema],
  ratings: {
    type: Number,
    default: 0,
  },
  purchased: {
    type: Number,
    default: 0,
  },
});
const CourseModel: Model<ICourse> = mongoose.model("course", courseSchema);
export default CourseModel;