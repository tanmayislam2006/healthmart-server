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
  const { customerId, medicineId, rating, content } = data;
  const orderItem = await prisma.orderItems.findFirst({
    where: { medicineId },
    include: {
      order: true,
    },
  });

  if (!orderItem || !orderItem.order) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Order not found for this medicine",
    );
  }

  const order = orderItem.order;

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

  const existingReview = await prisma.review.findFirst({
    where: {
      customerId,
      orderId: order.id,
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
      orderId: order.id,
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
