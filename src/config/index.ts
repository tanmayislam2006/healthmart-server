import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
const config = {
  port: process.env.PORT,
  appUrl: process.env.APP_URL,
  connectionString: process.env.DB_URL,
};
export default config