import { mongoose } from "mongoose";
import { v4 as uuidv4 } from "uuid";
const ActivityFormSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    published: {
      type: Boolean,
      default: false,
    },
    ActivityFormname: {
      type: String,
    },
    ActivityDescription: {
      type: String,
    },
    ActivityContent: {
      type: String,
    },
    ActivityVisits: {
      type: Number,
      default: 0,
    },
    ActivityType: {
      type: String,
    },
    ActivityShareurl: { type: String, default: uuidv4, unique: true }, // ใช้ uuidv4 สำหรับค่าเริ่มต้น
    ActivitySubmissions: {
      type: Number,
      default: 0,
    },

    FormSubmissions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Formsubs" },
    ],
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const ActivityForm =
  mongoose.models.ActivityForms ||
  mongoose.model("ActivityForms", ActivityFormSchema);

export default ActivityForm;
