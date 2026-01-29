import { prisma } from "../../libs/prisma";
import ApiError from "../../helper/apiError";
import httpStatus from "http-status";
import { OrderStatus } from "../../generated/prisma/enums";

const getAllMedicineBySeller = async (sellerId: string) => {
  return prisma.medicine.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
  });
};

const addMedicine = async (
  sellerId: string,
  data: {
    categoryId: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer?: string;
  },
) => {
  return prisma.medicine.create({
    data: {
      ...data,
      sellerId,
    },
  });
};

const updateMedicineInfo = async (
  sellerId: string,
  id: string,
  data: Partial<{
    categoryId: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer?: string;
  }>,
) => {
  const medicine = await prisma.medicine.findUnique({ where: { id } });

  if (!medicine) {
    throw new ApiError(httpStatus.NOT_FOUND, "Medicine not found");
  }

  if (medicine.sellerId !== sellerId) {
    throw new ApiError(httpStatus.FORBIDDEN, "You cannot update this medicine");
  }

  return prisma.medicine.update({
    where: { id },
    data,
  });
};

const deleteMedicine = async (sellerId: string, id: string) => {
  const medicine = await prisma.medicine.findUnique({ where: { id } });

  if (!medicine) {
    throw new ApiError(httpStatus.NOT_FOUND, "Medicine not found");
  }

  if (medicine.sellerId !== sellerId) {
    throw new ApiError(httpStatus.FORBIDDEN, "You cannot delete this medicine");
  }

  return prisma.medicine.delete({ where: { id } });
};

const getSellerOrders = async (sellerId: string) => {
  return prisma.order.findMany({
    where: {
      orderItems: {
        some: {
          medicine: {
            sellerId,
          },
        },
      },
    },
    include: {
      orderItems: {
        include: {
          medicine: true,
        },
      },
      customer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateOrderStatus = async (
  sellerId: string,
  orderId: string,
  status: OrderStatus,
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          medicine: true,
        },
      },
    },
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  const isSellerOrder = order.orderItems.some(
    (item) => item.medicine.sellerId === sellerId,
  );

  if (!isSellerOrder) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this order",
    );
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

export const sellerService = {
  getAllMedicineBySeller,
  addMedicine,
  updateMedicineInfo,
  deleteMedicine,
  getSellerOrders,
  updateOrderStatus,
};
