import app from "./app";
import config from "./config";

const port = config.port || 5000;
async function run() {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  } catch (error) {
    process.exit(1);
    console.error(error);
  }
}
run()
