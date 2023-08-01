import express from "express";
import {
  changePassword,
  createUser,
  deleteUser,
  getUser,
  getOneUser,
  resetMail,
  signin,
  verifyUser,
  refreshUserToken,
  updateUserImage,
  editProfile,
  updateUser,
  updateUserCoverImage,
  academicUpdate,
  updateLocation,
  religiousUpdate,
  professionalUpdate,
  bioUpdate,
} from "../controller/UserController";
import multer from "multer";
let uploadData = multer();

const router = express.Router();

router.route("/").get(getUser);

router.route("/:id/get-one").get(getOneUser);

router.route("/:id/image").patch(uploadData.single("avatar"), updateUserImage);

router
  .route("/:id/cover-image")
  .patch(uploadData.single("avatar"), updateUserCoverImage);

router.route("/:id/update-info").patch(updateUser);

router.route("/:id/delete-account").delete(deleteUser);

router.route("/register").post(createUser);

router.route("/:id/:token/verify").get(verifyUser);

router.route("/reset-password").patch(resetMail);

router.route("/:id/:token/change-password").patch(changePassword);

router.route("/sign-in").post(signin);

router.route("/refresh-access-token").post(refreshUserToken);

router.route("/:id/update-academic-info").patch(academicUpdate);

router.route("/:id/update-location-info").patch(updateLocation);

router.route("/:id/update-religion-info").patch(religiousUpdate);

router.route("/:id/update-profession-info").patch(professionalUpdate);

router.route("/:id/update-bio-info").patch(bioUpdate);


export default router;
