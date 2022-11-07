import { Request, Response } from "express";
import { omit } from "lodash";
import {
  createUser,
  deleteUser,
  editUser,
  getAllUsers,
  getRentalDataForUser,
  getUserInfo,
} from "../service/user.service";
import log from "../utils/logger";

export async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
  } catch (error: any) {
    log.error(error);
    return res.status(409).send(error.message);
  }
}

export async function editUserHandler(req: Request, res: Response) {
  try {
    await editUser(req.params._id, req.body);
    return res.sendStatus(200);
  } catch (error: any) {
    log.error(error);
    return res.status(409).send(error.message);
  }
}

export async function deleteUserHandler(req: Request, res: Response) {
  const body = req.body;
  await deleteUser(body);
  return res.sendStatus(200);
}

export async function getUserInfoHandler(req: Request, res: Response) {
  try {
    const user = await getUserInfo(res.locals.user._id);
    return res.send(omit(user, "password"));
  } catch (error: any) {
    /*    log.error(error); */
    return res.status(400).send(error.message);
  }
}

export async function getAllUsersHandler(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    return res.send(users);
  } catch (error: any) {
    /*    log.error(error); */
    return res.status(400).send(error.message);
  }
}

export async function getRentalDataForUserHandler(req: Request, res: Response) {
  try {
    const userId = req.params._id;
    const rentalData = await getRentalDataForUser(userId);
    return res.status(200).send(rentalData);
  } catch (error: any) {
    /*    log.error(error); */
    return res.status(400).send(error.message);
  }
}
