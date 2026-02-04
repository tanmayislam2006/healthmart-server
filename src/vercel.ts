type Handler = (req: unknown, res: unknown) => unknown | Promise<unknown>;

let handler: Handler | null = null;

async function getHandler(): Promise<Handler> {
  if (handler) {
    return handler;
  }

  const mod = await import("./app");
  handler = mod.default as Handler;
  return handler;
}

export default async function vercelHandler(req: unknown, res: unknown) {
  try {
    const h = await getHandler();
    return await h(req, res);
  } catch (error) {
    // Surface boot/runtime errors in Vercel logs and return a 500 response.
    // This prevents a hard crash and makes the root cause visible.
    console.error("Vercel boot error:", error);
    const response = res as {
      statusCode?: number;
      setHeader?: (name: string, value: string) => void;
      end?: (body?: string) => void;
    };
    response.statusCode = 500;
    response.setHeader?.("Content-Type", "application/json");
    response.end?.(
      JSON.stringify({
        message: "Server failed to start",
        error: String(error),
      }),
    );
  }
}
