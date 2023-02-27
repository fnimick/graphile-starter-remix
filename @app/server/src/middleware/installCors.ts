import cors from "cors";
import { Express } from "express";

const tmpWebUrl = process.env.WEB_URL;

if (!tmpWebUrl || typeof tmpWebUrl !== "string") {
  throw new Error("Envvar WEB_URL is required.");
}
const WEB_URL = tmpWebUrl;

const corsOptions: cors.CorsOptions = {
  origin: WEB_URL,
  credentials: true,
};

export default function installCors(app: Express) {
  app.options("*", cors(corsOptions));
  app.use(cors(corsOptions));
}
