import { Router } from "express";
import auth from "../../middlewares/authGaurd";
import { UserRole } from "../../generated/prisma/enums";
import { customerController } from "./customer.controller";

const router = Router();

router.get(
  "/stats",
  auth(UserRole.CUSTOMER),
  customerController.getCustomerStats
);
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
