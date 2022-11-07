import mongoose from "mongoose";
import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  LeanDocument,
} from "mongoose";
import Bike, { BikeDocument, RentalsDocument } from "../models/bike.model";
import { UserDocument } from "../models/user.model";
import { checkDates } from "../utils/checkDates";

export function createBike(input: DocumentDefinition<BikeDocument>) {
  return Bike.create(input);
}

export function updateBike(
  _id: BikeDocument["_id"],
  input: DocumentDefinition<BikeDocument>
) {
  return Bike.updateOne({ _id }, input);
}

export function deleteBike(input: BikeDocument["_id"][]) {
  return Bike.deleteMany({
    _id: {
      $in: input,
    },
  });
}

export function getBikes() {
  return Bike.find();
}

export function getBike(_id: BikeDocument["_id"]) {
  return Bike.findById(_id);
}

export async function rentABike(
  bike: BikeDocument,
  user: LeanDocument<UserDocument & { _id: any }> | null,
  wantedDates: Date[]
) {
  if (bike.rentals?.length == 0) {
    try {
      const checkedArray = bike.rentals.map(({ start, end }) => {
        return checkDates(wantedDates, [start, end]);
      });
      if (checkedArray.every(async (e: boolean) => e)) {
        bike.rentals.push({
          start: wantedDates[0],
          end: wantedDates[1],
          user: user!._id,
          price: bike.price,
          bikeId: bike._id,
          bikeModel: bike.bikeModel,
          name: user!.name,
        });
        await bike.save();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  } else {
    bike.rentals?.push({
      start: wantedDates[0],
      end: wantedDates[1],
      user: user!._id,
      price: bike.price,
      bikeId: bike._id,
      bikeModel: bike.bikeModel,
      name: user!.name,
    });
    await bike.save();
    return true;
  }
}

export async function cancelABikeRental(
  bike: BikeDocument,
  rentalId: RentalsDocument["_id"]
) {
  await bike.rentals?.id(rentalId)?.remove();
  return await bike.save();
}

export async function rateABike(
  bike: BikeDocument,
  rentalId: RentalsDocument["_id"],
  rating: number
) {
  let rental = bike.rentals?.id(rentalId);
  rental ? (rental.rating = rating) : true;
  return await bike.save();
}
