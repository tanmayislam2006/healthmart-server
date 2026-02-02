import express, { Application } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./libs/auth.js";
import globalErrorHandler from "./helper/globalErrorHandler.js";
import handleNotFound from "./helper/handleNotFound.js";
import { medicineRouter } from "./modules/medicine/medicine.route.js";
import { sellerRouter } from "./modules/seller/seller.route.js";
import { adminRouter } from "./modules/admin/admin.route.js";
import { orderRouter } from "./modules/order/order.route.js";
import { customerRouter } from "./modules/customer/customer.route.js";


const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);


app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/medicine", medicineRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/order", orderRouter);
app.use("/api/customer", customerRouter);

app.get("/", (req, res) => {
  res.send("Health Mart Server Is Running");
});
app.use(handleNotFound);
app.use(globalErrorHandler);
export default app;
