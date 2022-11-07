import mongoose from "mongoose";
import { UserDocument } from "./user.model";

export interface BikeDocument extends mongoose.Document {
  bikeModel: string;
  price: number;
  color: string;
  location: string;
  rating?: number;
  rentals?: mongoose.Types.DocumentArray<RentalsDocument & mongoose.Document>;
  createdAt: Date;
  updatedAt: Date;
}

export interface RentalsDocument extends mongoose.Document {
  start: Date;
  end: Date;
  user: UserDocument["_id"];
  price: number;
  bikeId: BikeDocument["_id"];
  rating?: number;
  name: UserDocument["name"];
  bikeModel: string;
}

const RentalsSchema = new mongoose.Schema({
  start: { type: Date },
  end: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  price: { type: Number },
  rating: { type: Number },
  bikeId: { type: mongoose.Schema.Types.ObjectId, ref: "Bike" },
  name: { type: String },
  bikeModel: { type: String },
});

const BikeSchema = new mongoose.Schema(
  {
    bikeModel: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    rentals: [RentalsSchema],
  },
  {
    timestamps: true,
  }
);

BikeSchema.pre("save", async function (next) {
  const bike = this as BikeDocument;
  let totalRating = 0;
  let ratedRentalCount = 0;
  bike.rentals?.forEach((rental) => {
    if (rental.rating) {
      totalRating += rental.rating;
      ratedRentalCount += 1;
    }
  });
  bike.rating = totalRating / ratedRentalCount;
  return next();
});

const Bike = mongoose.model<BikeDocument>("Bike", BikeSchema);

export default Bike;
