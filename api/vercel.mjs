import { createRequire } from "module"; const require = createRequire(import.meta.url);
import "./chunk-IYXJTTAZ.mjs";

// src/vercel.ts
var handler = null;
async function getHandler() {
  if (handler) {
    return handler;
  }
  const mod = await import("./app-56GJ4JJI.mjs");
  handler = mod.default;
  return handler;
}
async function vercelHandler(req, res) {
  try {
    const h = await getHandler();
    return await h(req, res);
  } catch (error) {
    console.error("Vercel boot error:", error);
    const response = res;
    response.statusCode = 500;
    response.setHeader?.("Content-Type", "application/json");
    response.end?.(
      JSON.stringify({
        message: "Server failed to start",
        error: String(error)
      })
    );
  }
}
export {
  vercelHandler as default
};
