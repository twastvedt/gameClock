import express, { static as _static } from 'express'
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { join } from 'path';

dotenv.config();

const production = process.env.NODE_ENV === "production";

const app = express()
  .set("port", process.env.SERVER_PORT || 3000)
  .use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

if (production) {
  app.use(_static(join(__dirname, "../clientBuild"), { maxAge: "1y", etag: false }));
}

app.listen(app.get("port"), () => {
  console.log(
    "App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("Press CTRL-C to stop\n");
});

export default app;
