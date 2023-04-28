import { NextFunction, Request, Response } from "express";
import prisma from "../db";

/**
 * TODO include user on request object with TS
 * @param req
 * @param res
 */

// Get all products /product
export const getProducts = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      // @ts-ignore
      id: req.user.id,
    },
    include: {
      products: true,
    },
  });
  // insert error handling
  res.json({ data: user.products });
};

// Get singular product /product/:id
export const getOneProduct = async (req: Request, res: Response) => {
  // get product id from the query on the url
  const id = req.params.id;
  const product = await prisma.product.findFirst({
    where: {
      id: id,
      // @ts-ignore
      belongsToId: req.user.id,
    },
  });
  // insert error handling
  res.json({ data: product });
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        name: name,
        // @ts-ignore
        belongsToId: req.user.id,
        // * can create a relation with the product and user
      },
    });
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  // check if users is associetd with product id
  // @ts-ignore
  const userId = req.user.id as string;
  try {
    const updated = await prisma.product.update({
      where: {
        // compound index or join index
        // pairs product id with user id. This block integrity errors
        id_belongsToId: {
          id: req.params.id,
          belongsToId: userId,
        },
      },
      data: {
        name: name,
      },
    });
    return res.json({ data: updated });
  } catch (err) {
    // updating record that doesn't exist
    err.type = "input";
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.id as string;
  const deleted = await prisma.product.delete({
    where: {
      id_belongsToId: {
        id: req.params.id,
        belongsToId: userId,
      },
    },
  });

  res.json({ data: deleted });
};
