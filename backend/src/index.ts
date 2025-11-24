import { createApp } from "./core/app";
import "./core/db/firebase"; // Import to ensure init runs
import { env } from "./core/config/env";

const start = async () => {
  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(
      `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
    );
  });
};

start();
