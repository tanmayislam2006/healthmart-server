import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
const config = {
  port: process.env.PORT,
  appUrl: process.env.APP_URL,
  connectionString: process.env.DATABASE_URL,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  appUser: process.env.APP_USER,
  appPass: process.env.APP_PASS,
};
export default config;
