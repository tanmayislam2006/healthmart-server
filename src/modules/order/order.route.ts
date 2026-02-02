import { Router } from "express";
import auth from "../../middlewares/authGaurd.js";
import { UserRole } from "../../generated/prisma/enums.js";
import { orderController } from "./order.controller.js";

const router = Router();
router.post("/", auth(UserRole.CUSTOMER), orderController.createOrder);
router.get("/", auth(UserRole.CUSTOMER), orderController.userAllOrders);
router.get("/:id", auth(UserRole.CUSTOMER), orderController.orderInfoById);
export const orderRouter = router;
