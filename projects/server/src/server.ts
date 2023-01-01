import express, { static as _static, json } from "express";
import dotenv from "dotenv";
import { join } from "path";
import { state } from "./state";
import cors from "cors";
import history from "connect-history-api-fallback";

dotenv.config({ path: join(__dirname, "../../../.env") });

const production = process.env.NODE_ENV === "production";

const app = express()
  .set("port", process.env.VITE_SERVER_PORT || 3000)
  .use(json(), cors(), history());

if (production) {
  app.use(
    _static(join(__dirname, "../clientBuild"), { maxAge: "1y", etag: false })
  );
}

const server = app.listen(app.get("port"), () => {
  console.log(
    "App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("Press CTRL-C to stop\n");
});

state.setUpSockets(server);

export default app;
