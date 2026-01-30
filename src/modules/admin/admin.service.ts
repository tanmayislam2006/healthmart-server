import {
  CategoryStatus,
  SRequest,
  UserRole,
  UserStatus,
} from "../../generated/prisma/enums";
import { prisma } from "../../libs/prisma";
import ApiError from "../../helper/apiError";
import httpStatus from "http-status";

const getAllUser = async () => {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateUser = async (
  id: string,
  data: {
    role?: UserRole;
    status?: UserStatus;
  },
) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!data.role && !data.status) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "At least one field (role or status) must be provided",
    );
  }

  return prisma.user.update({
    where: { id },
    data: {
      ...(data.role && { role: data.role }),
      ...(data.status && { status: data.status }),
    },
  });
};
const getAllMedicines = async () => {
  return prisma.medicine.findMany({
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          medicine: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
const createCategory = async (data: { name: string; description?: string }) => {
  return await prisma.categories.create({
    data,
  });
};
const getAllCategories = async () => {
  return prisma.categories.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};
const updateCategory = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    status?: CategoryStatus;
  },
) => {
  const category = await prisma.categories.findUnique({ where: { id } });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  return prisma.categories.update({
    where: { id },
    data,
  });
};

const getAllSellerRequests = async () => {
  return prisma.sellerRequest.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateSellerRequestStatus = async (
  requestId: string,
  status: SRequest,
) => {
  const request = await prisma.sellerRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, "Seller request not found");
  }

  if (request.status !== SRequest.PENDING) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Seller request already processed",
    );
  }

  return prisma.$transaction(async (tx) => {
    const updatedRequest = await tx.sellerRequest.update({
      where: { id: requestId },
      data: {
        status,
      },
    });

    if (status === SRequest.APPROVED) {
      await tx.user.update({
        where: { id: request.userId },
        data: {
          role: UserRole.SELLER,
        },
      });
    }

    return updatedRequest;
  });
};
export const adminService = {
  getAllUser,
  updateUser,
  getAllMedicines,
  getAllOrders,
  createCategory,
  getAllCategories,
  updateCategory,
  getAllSellerRequests,
  updateSellerRequestStatus
};
