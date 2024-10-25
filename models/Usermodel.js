import { mongoose } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    Firstname: {
      type: String,
    },
    Lastname: {
      type: String,
    },
    Date: {
      type: String,
    },
    Telephone: {
      type: String,
    },
    Address: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },

    provider: {
      type: String,
      default: "credentials",
    },
    activitiesParticipated: [
      {
        activityId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ActivityForms",
        },
        bookingStatus: {
          type: String,
          enum: ["pending", "booked", "failed"],
          default: "pending", // กำหนดสถานะเริ่มต้น
        },
        registrationStatus: {
          type: String,
          enum: ["pending", "registered", "failed"],
          default: "pending",
        },
        questionnaireStatus: {
          type: String,
          enum: ["pending", "completed", "not_required"],
          default: "pending",
        },
        completionStatus: {
          type: String,
          enum: ["incomplete", "completed"],
          default: "incomplete",
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    userType: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.users || mongoose.model("users", UserSchema);

export default User;
