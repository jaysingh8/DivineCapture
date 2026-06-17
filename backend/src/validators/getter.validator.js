import { body, validationResult } from "express-validator";



function validationResultReq (req, res, next)  {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
};

export const profileValidator = [
  body("profession")
    .isArray({ min: 1 })
    .withMessage("At least one profession is required"),

  body("bio")
    .notEmpty()
    .withMessage("Bio is required")
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("experience")
    .notEmpty()
    .withMessage("Experience is required")
    .isNumeric()
    .withMessage("Experience must be a number"),

  body("city")
    .notEmpty()
    .withMessage("City is required"),

  body("equipments")
    .isArray({ min: 1 })
    .withMessage("At least one equipment is required"),

  validationResultReq
];