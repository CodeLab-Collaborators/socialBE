import express from "express";
import {
  changePassword,
  createUser,
  deleteUser,
  getUser,
  getOneUser,
  resetMail,
  signin,
  updateUser,
  verifyUser,
  refreshUserToken,
} from "../controller/UserController";

const router = express.Router();

router.route("/").get(getUser);

router.route("/:id/get-one").get(getOneUser);

router.route("/:id/update-info").patch(updateUser);

router.route("/:id/delete-account").delete(deleteUser);

router.route("/create").post(createUser);

router.route("/:id/:token/verify").get(verifyUser);

router.route("/reset-password").patch(resetMail);
router.route("/:id/:token/change-password").patch(changePassword);

router.route("/signin").post(signin);
router.route("/refresh-access-token").post(refreshUserToken);

export default router;
