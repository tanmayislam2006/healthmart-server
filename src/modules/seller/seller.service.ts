import { prisma } from "../../libs/prisma";
import ApiError from "../../helper/apiError";
import httpStatus from "http-status";
import { OrderStatus } from "../../generated/prisma/enums";

const getSellerStats = async (sellerId: string) => {
  const [
    totalMedicines,
    orderStats,
    deliveredOrders,
    pendingOrders,
    revenueAgg,
    recentOrders,
    lowStockMedicines,
  ] = await Promise.all([
    prisma.medicine.count({
      where: { sellerId },
    }),

    prisma.orderItems.groupBy({
      by: ["orderId"],
      where: {
        medicine: { sellerId },
      },
      _count: true,
    }),

    prisma.order.count({
      where: {
        status: OrderStatus.DELIVERED,
        orderItems: {
          some: {
            medicine: { sellerId },
          },
        },
      },
    }),

    prisma.order.count({
      where: {
        status: { in: [OrderStatus.PLACED, OrderStatus.SHIPPED] },
        orderItems: {
          some: {
            medicine: { sellerId },
          },
        },
      },
    }),

    prisma.orderItems.aggregate({
      where: {
        medicine: { sellerId },
      },
      _sum: {
        price: true,
      },
    }),

    prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            medicine: { sellerId },
          },
        },
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: { name: true },
        },
      },
    }),

    prisma.medicine.findMany({
      where: {
        sellerId,
        stock: { lte: 10 },
      },
      take: 5,
      select: {
        id: true,
        name: true,
        stock: true,
      },
    }),
  ]);

  return {
    stats: {
      totalMedicines,
      totalOrders: orderStats.length,
      deliveredOrders,
      pendingOrders,
      totalRevenue: revenueAgg._sum.price ?? 0,
    },
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      customerName: order.customer.name,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
    })),
    lowStockMedicines,
  };
};

const getAllMedicineBySeller = async (sellerId: string) => {
  return prisma.medicine.findMany({
    where: { sellerId },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
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
          medicine: {
            select: {
              name: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
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
  getSellerStats,
};
