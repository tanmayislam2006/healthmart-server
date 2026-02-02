import { Router } from "express";
import { medicineController } from "./medicine.controller.js";

const router = Router();
router.get("/category", medicineController.getCategory);
router.get("/", medicineController.getMedicine);
router.get("/:id", medicineController.getMedicineById);
export const medicineRouter = router;
