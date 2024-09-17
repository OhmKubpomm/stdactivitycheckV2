import { mongoose } from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ActivityForms",
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback =
  mongoose.models.Feedbacks || mongoose.model("Feedbacks", FeedbackSchema);

export default Feedback;
