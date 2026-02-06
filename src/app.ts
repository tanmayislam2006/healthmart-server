import express, { Application } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./libs/auth";
import globalErrorHandler from "./helper/globalErrorHandler";
import handleNotFound from "./helper/handleNotFound";
import { medicineRouter } from "./modules/medicine/medicine.route";
import { sellerRouter } from "./modules/seller/seller.route";
import { adminRouter } from "./modules/admin/admin.route";
import { orderRouter } from "./modules/order/order.route";
import { customerRouter } from "./modules/customer/customer.route";


const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: [process.env.APP_URL!, "http://localhost:3000"],
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
