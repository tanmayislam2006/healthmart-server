import catchAsync from "../../helper/asyncHandler";
import sendResponse from "../../helper/sendResponse";
import { adminService } from "./admin.service";
import httpStatus from "http-status";

const getAllUser = catchAsync(async (req, res) => {
  const result = await adminService.getAllUser();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.updateUser(id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const getAllMedicines = catchAsync(async (req, res) => {
  const result = await adminService.getAllMedicines();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicines fetched successfully",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const result = await adminService.getAllOrders();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders fetched successfully",
    data: result,
  });
});

const createCategory = catchAsync(async (req, res) => {
  const result = await adminService.createCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const result = await adminService.getAllCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories fetched successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.updateCategory(id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

export const adminController = {
  getAllUser,
  updateUser,
  getAllMedicines,
  getAllOrders,
  createCategory,
  getAllCategories,
  updateCategory,
};
