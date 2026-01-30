import httpStatus from "http-status";
import { prisma } from "../../libs/prisma";
import ApiError from "../../helper/apiError";
import { SRequest, UserRole } from "../../generated/prisma/enums";

type CreateSellerRequestPayload = {
  userId: string;
  address?: string;
};

type CreateReviewPayload = {
  customerId: string;
  orderId: string;
  medicineId: string;
  rating: number;
  content: string;
};

const createSellerRequest = async (data: CreateSellerRequestPayload) => {
  const { userId, address } = data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.role !== UserRole.CUSTOMER) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only customers can request to become sellers",
    );
  }

  const existingRequest = await prisma.sellerRequest.findFirst({
    where: {
      userId,
      status: SRequest.PENDING,
    },
  });

  if (existingRequest) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "You already have a pending seller request",
    );
  }

  return prisma.sellerRequest.create({
    data: {
      userId,
      address: address ?? null,
    },
  });
};

const createReview = async (data: CreateReviewPayload) => {
  const { customerId, orderId, medicineId, rating, content } = data;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: true,
    },
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  if (order.customerId !== customerId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to review this order",
    );
  }

  if (order.status !== "DELIVERED") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can review only delivered orders",
    );
  }

  const isMedicineInOrder = order.orderItems.some(
    (item) => item.medicineId === medicineId,
  );

  if (!isMedicineInOrder) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This medicine was not part of the order",
    );
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      customerId,
      orderId,
      medicineId,
    },
  });

  if (existingReview) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "You have already reviewed this medicine",
    );
  }

  return prisma.review.create({
    data: {
      customerId,
      orderId,
      medicineId,
      rating,
      content,
    },
  });
};

export const customerService = {
  createSellerRequest,
  createReview,
};
