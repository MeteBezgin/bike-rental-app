import { DocumentDefinition, FilterQuery } from "mongoose";
import { omit } from "lodash";
import User, { UserDocument } from "../models/user.model";
import log from "../utils/logger";
import Bike from "../models/bike.model";
import mongoose from "mongoose";

export async function createUser(input: DocumentDefinition<UserDocument>) {
  try {
    if (input.email === "admin@admin.com") {
      input.role = "MANAGER";
      return await User.create(input);
    }
    return await User.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return User.findOne(query).lean();
}

export async function editUser(
  _id: UserDocument["_id"],
  input: DocumentDefinition<UserDocument>
) {
  return User.updateOne({ _id }, input);
}

export function deleteUser(input: UserDocument["_id"][]) {
  return User.deleteMany({
    _id: {
      $in: input,
    },
  });
}

export async function getUserInfo(_id: string) {
  try {
    return User.findOne({
      _id,
    }).lean();
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getRentalDataForUser(_id: string) {
  return Bike.aggregate([
    { $unwind: "$rentals" },
    { $match: { "rentals.user": new mongoose.Types.ObjectId(_id) } },
    {
      $project: {
        _id: "$rentals._id",
        bikeModel: "$bikeModel",
        location: "$location",
        start: "$rentals.start",
        end: "$rentals.end",
        price: "$price",
        rating: "$rentals.rating",
        bikeId: "$rentals.bikeId",
      },
    },
  ]).exec();
}

export async function getAllUsers() {
  return await User.aggregate([
    {
      $lookup: {
        from: "bikes",
        localField: "_id",
        foreignField: "rentals.user",
        as: "details",
        pipeline: [
          {
            $project: {
              rentals: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        password: 0,
      },
    },
  ]).exec();
}
