import app from "./app";
import config from "./config";
import { prisma } from "./libs/prisma";

const port = config.port || 5000;
async function run() {
  try {
    await prisma.$connect();
    console.log("Database Connected");
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    process.exit(1);
    console.error(error);
  }
}
run();
