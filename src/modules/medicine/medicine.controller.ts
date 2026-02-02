import catchAsync from "../../helper/asyncHandler";
import sendResponse from "../../helper/sendResponse";
import httpStatus from "http-status";
import { medicineService } from "./medicine.service";
import paginationHelper from "../../helper/paginationHelper";

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
  const { search } = req.query;
  const searchStr = typeof search === "string" ? search : undefined;
  const isFeatured = req.query.isFeatured
    ? req.query.isFeatured === "true"
      ? true
      : req.query.isFeatured === "false"
        ? false
        : undefined
    : undefined;
  const { page, limit, skip } = paginationHelper(req.query);
  const { category } = req.params;
  const result = await medicineService.getMedicine({
    search: searchStr,
    category: category as string,
    isFeatured,
    page,
    limit,
    skip,
  });

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
