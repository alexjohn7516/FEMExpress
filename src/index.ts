import * as dotenv from "dotenv";
import app from "./server";
import config from "./config";

dotenv.config();
const PORT = 3000;

app.listen(config.port, () => {
  console.log(`listening on port http://localhost:${config.port}`);
});
