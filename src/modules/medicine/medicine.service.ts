import { prisma } from "../../libs/prisma";
const getCategory = async () => {
  return prisma.categories.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getMedicine = async ({
  search,
  category,
  isFeatured,
  page,
  limit,
  skip,
}: {
  search: string | undefined;
  category: string | undefined;
  isFeatured: boolean | undefined;
  page: number;
  limit: number;
  skip: number;
}) => {
  const searchCondition: any = [];
  if (search) {
    searchCondition.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          manufacturer: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (category) {
    searchCondition.push({
      categoryId: category,
    });
  }
  if (typeof isFeatured === "boolean") {
    searchCondition.push({
      isFeatured,
    });
  }

  const whereCondition =
    searchCondition.length > 0 ? { AND: searchCondition } : {};

  const total = await prisma.medicine.count({
    where: whereCondition,
  });

  const medicines = await prisma.medicine.findMany({
    take: limit,
    skip,
    where: whereCondition,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: medicines,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getMedicineById = async (id: string) => {
  return prisma.medicine.findUniqueOrThrow({
    where: { id },
    include: {
      reviews: {
        select: {
          content: true,
          rating: true,
        },
      },
    },
  });
};

export const medicineService = {
  getCategory,
  getMedicine,
  getMedicineById,
};
