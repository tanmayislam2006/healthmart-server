import { prisma } from "../../libs/prisma";

const getCategory = async () => {
  return prisma.categories.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getMedicine = async () => {
  return prisma.medicine.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getMedicineById = async (id: string) => {
  return prisma.medicine.findUniqueOrThrow({
    where: { id },
  });
};

export const medicineService = {
  getCategory,
  getMedicine,
  getMedicineById,
};
