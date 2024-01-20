import express from "express";
import isEmptyBody from "../../middlewares/isEmptyBody.js"
import isCheckId from "../../middlewares/isCheckId.js"
import usersController from "../../controllers/users-controller.js";
import isCheckHeaders from "../../middlewares/isCheckHeaders.js";

const usersRouter = express.Router();

usersRouter.post("/register", isEmptyBody, usersController.signup);

usersRouter.post("/login", isEmptyBody, usersController.signin)

usersRouter.post("/logout", isCheckHeaders, usersController.sigout)

usersRouter.get("/current", isCheckHeaders, usersController.getCurrent)

usersRouter.patch("/", isCheckHeaders, isEmptyBody, usersController.updateSubs)

export default usersRouter