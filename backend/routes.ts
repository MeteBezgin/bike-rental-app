import { Express, Request, Response } from "express";
import {
  createBikeHandler,
  deleteBikeHandler,
  getBikesHandler,
  getBikeHandler,
  updateBikeHandler,
  rentABikeHandler,
  cancelABikeRentalHandler,
  rateABkikeHandler,
} from "./src/controller/bike.controller";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "./src/controller/session.controller";
import {
  createUserHandler,
  deleteUserHandler,
  editUserHandler,
  getAllUsersHandler,
  getRentalDataForUserHandler,
  getUserInfoHandler,
} from "./src/controller/user.controller";
import requireAdmin from "./src/middleware/requireAdminRole";
import requireUser from "./src/middleware/requireUser";
import { validateRequest } from "./src/middleware/validateRequest";
import { getUserInfo } from "./src/service/user.service";
import {
  createBikeSchema,
  deleteBikeSchema,
  getBikeSchema,
} from "./src/validationSchema/bike.schema";
import { createSessionSchema } from "./src/validationSchema/session.schema";
import { createUserSchema } from "./src/validationSchema/user.schema";

export default function (app: Express) {
  // Health check route
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  //Register route
  app.post(
    "/api/users/add",
    validateRequest(createUserSchema),
    createUserHandler
  );

  app.patch("/api/users/:_id", requireAdmin, editUserHandler);

  app.post("/api/users/delete", requireAdmin, deleteUserHandler);

  app.get("/api/users/all", requireAdmin, getAllUsersHandler);

  app.post("/api/bikes/rental", requireUser, rentABikeHandler);

  app.post("/api/bikes/rental/delete", requireUser, cancelABikeRentalHandler);

  app.post("/api/bikes/rental/rate", requireUser, rateABkikeHandler);

  app.get("/api/bikes/rental/:_id", requireUser, getRentalDataForUserHandler);

  //Get user info route
  app.get("/api/users/getUserInfo", getUserInfoHandler);

  //Create session
  app.post(
    "/api/sessions",
    validateRequest(createSessionSchema),
    createUserSessionHandler
  );

  //Get session
  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  //Delete session
  app.delete("/api/sessions", requireUser, deleteSessionHandler);

  // Create a bike
  app.post(
    "/api/bikes",
    validateRequest(createBikeSchema),
    requireAdmin,
    createBikeHandler
  );

  app.patch(
    "/api/bikes/:_id",
    validateRequest(createBikeSchema),
    requireAdmin,
    updateBikeHandler
  );

  // Get all bikes
  app.get("/api/bikes", requireUser, getBikesHandler);

  /* // Get all bikes from a user
  app.get("/api/bikes/:_id", validateRequest(getBikeSchema), getBikeHandler); */

  // Delete a bike
  app.post(
    "/api/bikes/delete",
    validateRequest(deleteBikeSchema),
    requireAdmin,
    deleteBikeHandler
  );
}
