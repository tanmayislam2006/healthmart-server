import catchAsync from "../../helper/asyncHandler";
import sendResponse from "../../helper/sendResponse";
import { sellerService } from "./seller.service";
import httpStatus from "http-status";

const getSellerStats = catchAsync(async (req, res) => {
  const userId = req?.user?.id;

  const result = await sellerService.getSellerStats(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Seller dashboard stats fetched successfully",
    data: result,
  });
});
const getAllMedicineBySeller = catchAsync(async (req, res) => {
  const userId = req?.user?.id;

  const result = await sellerService.getAllMedicineBySeller(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Seller medicines fetched successfully",
    data: result,
  });
});

const addMedicine = catchAsync(async (req, res) => {
  const userId = req?.user?.id;

  const result = await sellerService.addMedicine(userId as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Medicine added successfully",
    data: result,
  });
});

const updateMedicineInfo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req?.user?.id;

  const result = await sellerService.updateMedicineInfo(
    userId as string,
    id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine updated successfully",
    data: result,
  });
});

const deleteMedicine = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req?.user?.id;

  const result = await sellerService.deleteMedicine(
    userId as string,
    id as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine deleted successfully",
    data: result,
  });
});

const getSellerOrders = catchAsync(async (req, res) => {
  const userId = req?.user?.id;

  const result = await sellerService.getSellerOrders(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Seller orders fetched successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req?.user?.id;

  const result = await sellerService.updateOrderStatus(
    userId as string,
    id as string,
    status,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status updated successfully",
    data: result,
  });
});

export const sellerController = {
  getAllMedicineBySeller,
  addMedicine,
  updateMedicineInfo,
  deleteMedicine,
  getSellerOrders,
  updateOrderStatus,
  getSellerStats,
};
