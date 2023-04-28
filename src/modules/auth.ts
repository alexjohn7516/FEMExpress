import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * best practice is storing the token in the cookie
 * Server side the jwt will be in the authorization header
 * @param user username, email, id
 * @returns
 */
//
export const createJWT = (user: { username: string; id: string }) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET as string
  );

  return token;
};

/**
 * * JWT verification middleware with request augmentation
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const protect = (req: Request, res: Response, next: NextFunction) => {
  // We are designing this api to expect a bearer authorization token authenticate users
  const bearer = req.headers.authorization;
  // if not authorized 401 the request
  if (!bearer) {
    res.status(401);
    res.json({ message: "not authorized" });
    return;
  }

  //NOTE: This does not appropriately check for the "Bearer" label
  const [, token] = bearer.split(" "); // Bearer asdfjasldkfjasdklfj

  if (!token) {
    res.status(401);
    res.json({ message: "not valid token" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    // augments req to have a user method/variable attched to it
    // @ts-ignore
    req.user = user;
    next();
  } catch (e) {
    res.status(401);
    res.json({ message: "not valid token" });
    return;
  }
};

/**
 * Password authentication
 */
const SALT = 15;

export const comparePasswords = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, SALT);
};
