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
    Maplocation: {
      type: {
        type: String,
        enum: ["Point"], // ต้องเป็น 'Point'
        required: true,
      },
      coordinates: {
        type: [Number], // ต้องเป็น array ของตัวเลข [longitude, latitude]
        required: true,
      },
    },
  },
  { timestamps: true }
);

MapSchema.index({ Maplocation: "2dsphere" }); // เพิ่ม index สำหรับ geospatial queries

const Map = mongoose.models.Maps || mongoose.model("Maps", MapSchema);

export default Map;
