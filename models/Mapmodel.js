import { mongoose } from "mongoose";

const MapSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    MapName: {
      type: String,
    },
    MapAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

const Map = mongoose.models.Maps || mongoose.model("Maps", MapSchema);

export default Map;
