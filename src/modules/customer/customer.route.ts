import { Router } from "express";
import auth from "../../middlewares/authGaurd.js";
import { UserRole } from "../../generated/prisma/enums.js";
import { customerController } from "./customer.controller.js";

const router = Router();

router.post(
  "/seller-request",
  auth(UserRole.CUSTOMER),
  customerController.createSellerRequest
);

router.post(
  "/reviews",
  auth(UserRole.CUSTOMER),
  customerController.createReview
);

export const customerRouter = router;
