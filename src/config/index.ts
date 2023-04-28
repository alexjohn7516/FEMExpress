import merge from "lodash.merge";

// if NODE_ENV is not set
process.env.NODE_ENV = process.env.NODE_ENV || "development";
const stage = process.env.STAGE || "local";

let envConfig;

if (stage === "production") {
  envConfig = require("./prod").default;
} else if (stage === "testing") {
  envConfig = require("./testing").default;
  console.log("stage is testing");
} else {
  envConfig = require("./local").default;
}

const defaultConfig = {
  stage,
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  logging: false,
  secrets: {
    jwt: process.env.JWT_SECRET,
    dbURL: process.env.DATABASE_URL,
  },
};

export default merge(defaultConfig, envConfig);
