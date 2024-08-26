import { mongoose } from "mongoose";

const FormsubSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    Formsubcontent: { type: String, required: true },
  },
  { timestamps: true }
);

const Formsub =
  mongoose.models.Formsubs || mongoose.model("Formsubs", FormsubSchema);

export default Formsub;
