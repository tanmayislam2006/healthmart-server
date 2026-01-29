import { Router } from "express";
import { sellerController } from "./seller.controller";
import auth from "../../middlewares/authGaurd";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();

router.get(
  "/medicine",
  auth(UserRole.SELLER),
  sellerController.getAllMedicineBySeller,
);

router.post("/medicine", auth(UserRole.SELLER), sellerController.addMedicine);

router.patch(
  "/medicine/:id",
  auth(UserRole.SELLER),
  sellerController.updateMedicineInfo,
);

router.delete(
  "/medicine/:id",
  auth(UserRole.SELLER),
  sellerController.deleteMedicine,
);

router.get("/orders", auth(UserRole.SELLER), sellerController.getSellerOrders);

router.patch(
  "/orders/:id",
  auth(UserRole.SELLER),
  sellerController.updateOrderStatus,
);

export const sellerRouter = router;
