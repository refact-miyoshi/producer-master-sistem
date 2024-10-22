import mongoose, { Schema, Document } from "mongoose";

interface IMapPoint extends Document {
  latitude: number;
  longitude: number;
  description: string;
}

const MapPointSchema: Schema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  description: { type: String, required: true },
});

const MapPoint = mongoose.model<IMapPoint>("MapPoint", MapPointSchema);
export default MapPoint;
