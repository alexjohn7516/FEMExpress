import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ? What does a user need to be created? User information
  const { username, password, email } = req.body.user;
  const hashedPassword = await hashPassword(password);
  // have to hoist vairables to handle try catch blocks
  try {
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        email: email,
      },
    });
    const token = createJWT(user);

    res.json({ token });
  } catch (err) {
    // error handling with next
    err.type = "input";
    next(err);
  }

  //! WARNING! DO NOT PUT PASSWORD IN JWT TO SEND TO FRONTEND
};

/**
 * ? Where is all data validation being handled? Middleware. Documentation is key at this point
 * @param req must handle null data/undefined data or it will cause errors
 * @param res
 * @returns
 */
export const signIn = async (req: Request, res: Response) => {
  // find user
  //  must hanlde this if the req.body.user is not valid data or all data is not present
  const { username, password } = req.body.user; // no input validation on body
  const user = await prisma.user.findUnique({ where: { username } });

  // compare password
  const isValid = await comparePasswords(password, user.password);

  if (!isValid) {
    res.status(401);
    res.json({ message: "not authorized" });
    return;
  }

  const token = createJWT(user);
  res.json({ token });
};
