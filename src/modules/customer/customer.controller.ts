import httpStatus from "http-status";
import catchAsync from "../../helper/asyncHandler";
import sendResponse from "../../helper/sendResponse";
import { customerService } from "./customer.service";

const getCustomerStats = catchAsync(async (req, res) => {
  const userId = req.user?.id;

  const result = await customerService.getCustomerStats(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customer dashboard stats fetched successfully",
    data: result,
  });
});
const createSellerRequest = catchAsync(async (req, res) => {
  const userId = req.user?.id;

  const result = await customerService.createSellerRequest({
    userId: userId as string,
    address: req.body.address,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Seller request submitted successfully",
    data: result,
  });
});

const createReview = catchAsync(async (req, res) => {
  const userId = req.user?.id;

  const result = await customerService.createReview({
    customerId: userId as string,
    medicineId: req.body.medicineId,
    rating: req.body.rating,
    content: req.body.content,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

export const customerController = {
  createSellerRequest,
  createReview,
  getCustomerStats,
};
