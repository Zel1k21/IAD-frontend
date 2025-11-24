import { resolve } from "path";
import { generateApi } from "swagger-typescript-api";

generateApi({
  name: "api.ts",
  output: resolve(process.cwd(), "./src/modules"),
  url: "http://localhost:8082/swagger/doc.json",
  httpClientType: "axios",
});
