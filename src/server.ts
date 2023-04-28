import express, {
  type Request,
  type Response,
  type NextFunction,
  type Express,
} from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import { protect } from "./modules/auth";
import { createNewUser, signIn } from "./handlers/user";

const app: Express = express();

// currying example function that returns another function
const customLogger =
  (message: string) => (req: Request, res: Response, next: NextFunction) => {
    console.log(`Hello from ${message}`);
    next();
  };

// * How to change configuration to the server? It's with middle ware - Scott Moss FEM

// Cross origin research sharring
// Tells who or what can access this api
app.use(cors());
// * declaring no mounte path makes the middleware global
app.use(morgan("dev"));
// * allows client to send server json
app.use(express.json());
// * allows clients to add query strings and parameters and creates it as an object
app.use(express.urlencoded({ extended: true }));

// * Function that returns a custom middleware with a callable sequence
// app.use(customLogger("Custom message"));

// * Custom Middleware
// app.use((req, res, next) => {
//   // Request augmentation
//   //@ts-ignore
//   req.shhhh_secret = "doggy";
//   next();
// });

// order matters for registering listeners routing
// if two of the same route paths are on top of eachother the first one will only fire
// Error handlers come after handlers
// asynchronous error
app.get("/", (req, res, next) => {
  // setTimeout(() => {
  //   next(new Error("hello"));
  // });
  res.json({ message: "hello" });
});

// * we are protecting this whole router
app.use("/api", protect, router);

// handlers for user creation and user signin
app.post("/user", createNewUser);
app.post("/signin", signIn);

// * can add synchronous error handling, error logs, errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore
  if (err.type === "auth") {
    res.status(401);
    res.json({ message: "unauthorized" });
    //@ts-ignore
  } else if (err.type === "input") {
    res.status(400);
    res.json({ message: "invalid input" });
  } else {
    res.status(500);
    res.json({ message: "oops thats on us" });
  }
});

export default app;
