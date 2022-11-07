import { Request, Response } from "express";
import {
  createBike,
  deleteBike,
  getBikes,
  getBike,
  rentABike,
  updateBike,
  cancelABikeRental,
  rateABike,
} from "../service/bike.service";
import { getUserInfo } from "../service/user.service";
import log from "../utils/logger";

export async function createBikeHandler(req: Request, res: Response) {
  const body = req.body;
  const bike = await createBike({ ...body });
  return res.send(bike);
}

export async function updateBikeHandler(req: Request, res: Response) {
  const bikeId = req.params._id;
  const body = req.body;
  const bike = await getBike({ _id: bikeId });

  if (!bike) {
    return res.status(404).send("Bike not found");
  }

  await updateBike(bikeId, body);

  return res.sendStatus(200);
}

export async function deleteBikeHandler(req: Request, res: Response) {
  const body = req.body;
  await deleteBike(body);
  return res.sendStatus(200);
}

export async function getBikesHandler(req: Request, res: Response) {
  const bikes = await getBikes();
  return res.send(bikes);
}

export async function getBikeHandler(req: Request, res: Response) {
  const bike = await getBike(req.params._id);
  return res.send(bike);
}

export async function rentABikeHandler(req: Request, res: Response) {
  const bikeId = req.body.bikeId;
  const bike = await getBike({ _id: bikeId });
  const user = await getUserInfo(req.body.user);
  if (!bike) return res.status(404).send("Bike not found");
  (await rentABike(bike, user, [req.body.start, req.body.end]))
    ? res.status(200).send("Bike is successfully reserved")
    : res.status(400).send("Requested dates are not available");
}

export async function cancelABikeRentalHandler(req: Request, res: Response) {
  const bikeId = req.body.bikeId;
  const bike = await getBike({ _id: bikeId });
  if (!bike) return res.status(404).send("Bike not found");
  (await cancelABikeRental(bike, req.body.rentalId))
    ? res.status(200).send("Bike rental is successfully canceled")
    : res.status(400).send("Rental couldn't be canceled.");
}

export async function rateABkikeHandler(req: Request, res: Response) {
  const bikeId = req.body.bikeId;
  const bike = await getBike({ _id: bikeId });
  if (!bike) return res.status(404).send("Bike not found");
  (await rateABike(bike, req.body.rentalId, req.body.rating))
    ? res.status(200).send("Bike rental is successfully canceled")
    : res.status(400).send("Rental couldn't be canceled.");
}
