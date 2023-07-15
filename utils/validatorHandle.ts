import { body } from "express-validator";

export const validator = {
  createAdmin: [
    body("email")
      .trim()
      .toLowerCase()
      .normalizeEmail()
      .isEmail()
      .withMessage("Please enter the a right Email"),

    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Please enter your choice password of at laste 5 character"),

    body("confirm").custom((value: any, req: any) => {
      if (value !== req.body.password) {
        return "'Password doesn't match";
      } else {
        return true;
      }
    }),
  ],
};
