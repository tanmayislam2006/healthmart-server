import app from "./app.js";
import config from "./config/index.js";
import { prisma } from "./libs/prisma.js";

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
