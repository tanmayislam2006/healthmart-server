import httpStatus from "http-status";
import catchAsync from "../../helper/asyncHandler.js";
import { orderService } from "./order.service.js";
import sendResponse from "../../helper/sendResponse.js";

const createOrder = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await orderService.createOrder(userId as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

const userAllOrders = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await orderService.userAllOrders(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders fetched successfully",
    data: result,
  });
});

const orderInfoById = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  const result = await orderService.orderInfoById(
    userId as string,
    id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order details fetched successfully",
    data: result,
  });
});

export const orderController = {
  createOrder,
  userAllOrders,
  orderInfoById,
};
