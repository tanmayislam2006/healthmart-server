import catchAsync from "../../helper/asyncHandler";
import sendResponse from "../../helper/sendResponse";
import httpStatus from "http-status";
import { medicineService } from "./medicine.service";

const getCategory = catchAsync(async (req, res) => {
  const result = await medicineService.getCategory();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully fetched categories",
    data: result,
  });
});

const getMedicine = catchAsync(async (req, res) => {
  const result = await medicineService.getMedicine();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully fetched medicines",
    data: result,
  });
});

const getMedicineById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await medicineService.getMedicineById(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully fetched medicine",
    data: result,
  });
});

export const medicineController = {
  getCategory,
  getMedicine,
  getMedicineById,
};
