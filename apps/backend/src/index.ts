import "dotenv/config";
import app from "./app";
import { env } from "./config/env";

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Unseen Gadget API running on ${env.API_URL} (${env.NODE_ENV})`);
});

function shutdown(signal: string): void {
  console.log(`\n${signal} received, shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed. Bye!");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export default server;