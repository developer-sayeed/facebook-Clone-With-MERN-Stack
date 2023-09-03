import express from "express";

import {
  loggedInUser,
  userLogin,
  userRegister,
  activateAccount,
  activateAccountByCode,
} from "../controllers/userController.js";

const routes = express.Router();

//  route Manage

routes.post("/register", userRegister);
routes.post("/login", userLogin);
routes.get("/me", loggedInUser);
routes.get("/activate/:token", activateAccount);
routes.post("/activate-code", activateAccountByCode);

// Export routes
export default routes;
