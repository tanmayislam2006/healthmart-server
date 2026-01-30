import ApiError from "../../helper/apiError";
import httpStatus from "http-status";
import { prisma } from "../../libs/prisma";
import { Prisma } from "../../generated/prisma/client";

type OrderItemPayload = {
  medicineId: string;
  quantity: number;
};

type CreateOrderPayload = {
  address: string;
  items: OrderItemPayload[];
};

const createOrder = async (customerId: string, data: CreateOrderPayload) => {
  if (!data.items.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order items are required");
  }

  return prisma.$transaction(async (tx) => {
    const medicineChecks = await Promise.all(
      data.items.map(async (item) => {
        const medicine = await tx.medicine.findUnique({
          where: { id: item.medicineId },
        });

        if (!medicine) {
          throw new ApiError(httpStatus.NOT_FOUND, "Medicine not found");
        }

        if (medicine.stock < item.quantity) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            "Insufficient stock for medicine",
          );
        }

        return {
          medicineId: medicine.id,
          unitPrice: medicine.price,
          quantity: item.quantity,
        };
      }),
    );

    const total = medicineChecks.reduce(
      (sum, item) => sum.add(item.unitPrice.mul(item.quantity)),
      new Prisma.Decimal(0),
    );

    const order = await tx.order.create({
      data: {
        customerId,
        address: data.address,
        total,
      },
    });

    await Promise.all(
      medicineChecks.map((item) =>
        tx.orderItems.create({
          data: {
            orderId: order.id,
            medicineId: item.medicineId,
            quantity: item.quantity,
            price: item.unitPrice,
          },
        }),
      ),
    );

    await Promise.all(
      medicineChecks.map((item) =>
        tx.medicine.update({
          where: { id: item.medicineId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        }),
      ),
    );

    return order;
  });
};

const userAllOrders = async (customerId: string) => {
  if (!customerId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Customer ID required");
  }

  return prisma.order.findMany({
    where: {
      customerId,
    },
    include: {
      orderItems: {
        include: {
          medicine: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const orderInfoById = async (customerId: string, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  if (order.customerId !== customerId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to view this order",
    );
  }

  return prisma.order.findUniqueOrThrow({
    where: {
      id: orderId,
    },
    include: {
      orderItems: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const orderService = {
  createOrder,
  userAllOrders,
  orderInfoById,
};
