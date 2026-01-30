import { prisma } from "../libs/prisma";
import { UserRole } from "../generated/prisma/enums";

async function seedAdmin() {
  try {
    console.log("========= Admin Seeding Started =========");

    const adminEmail = "admin@mail.com";
    const adminPassword = "Admin@12345";

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("Admin already exists. Skipping seeding.");
      return;
    }

    console.log("Creating admin user via Better Auth...");

    const response = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Origin: "http://localhost:3000"
          
        },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
          name: "Admin User",
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    console.log("Admin user created. Updating role...");

    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        role: UserRole.ADMIN,
        emailVerified: true,
      },
    });

    console.log("========= Admin Seeding Completed =========");
  } catch (error: any) {
    console.error("Admin seed failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
