import { Router } from "express";
import { adminController } from "./admin.controller";
import auth from "../../middlewares/authGaurd";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();

router.get("/stats", auth(UserRole.ADMIN), adminController.getAdminStats);
router.get("/users", auth(UserRole.ADMIN), adminController.getAllUser);

router.patch("/users/:id", auth(UserRole.ADMIN), adminController.updateUser);

router.get("/medicines", auth(UserRole.ADMIN), adminController.getAllMedicines);

router.get("/orders", auth(UserRole.ADMIN), adminController.getAllOrders);

router.post(
  "/categories",
  auth(UserRole.ADMIN),
  adminController.createCategory,
);

router.get(
  "/categories",
  auth(UserRole.ADMIN),
  adminController.getAllCategories,
);

router.patch(
  "/categories/:id",
  auth(UserRole.ADMIN),
  adminController.updateCategory,
);
router.get(
  "/seller-req",
  auth(UserRole.ADMIN),
  adminController.getAllSellerRequests,
);
router.patch(
  "/update/:sellerId",
  auth(UserRole.ADMIN),
  adminController.updateSellerRequestStatus,
);

export const adminRouter = router;
