import catchAsync from "../../helper/asyncHandler";
import sendResponse from "../../helper/sendResponse";
import { sellerService } from "./seller.service";
import httpStatus from "http-status";

const getAllMedicineBySeller = catchAsync(async (req, res) => {
  const userId = req?.user?.id;
  const result = await sellerService.getAllMedicineBySeller(userId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Fetch All Data",
    data: result,
  });
});

const addMedicine = catchAsync(async (req, res) => {
  const userId = req?.user?.id;

  const result = await sellerService.addMedicine(userId as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully add medicine",
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
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully Update medicine",
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
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully Delete medicine",
    data: result,
  });
});

const getSellerOrders = catchAsync(async (req, res) => {
  const userId = req?.user?.id;
  const result = await sellerService.getSellerOrders(userId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Fetch All Orders",
    data: result,
  });
});
const updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req?.user?.id;

  const result = await sellerService.updateOrderStatus(
    userId as string,
    id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully Update Order",
    data: result,
  });
});

export const sellerController = {
  getAllMedicineBySeller,
  addMedicine,
  updateMedicineInfo,
  deleteMedicine,
  getSellerOrders,
  updateOrderStatus
};
