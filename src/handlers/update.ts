import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { Product, Update } from "@prisma/client";

/**
 * First Stuggle is authenticating the update with the user.
 * The hickup is in connecting the update back to the user because the update is
 * Connected to the product. Can i build a unique constraint on that?
 * Course Code below
 * * https://github.com/Hendrixer/api-design-v4-course/blob/main/src/handlers/update.ts
 */

// need explanation
// could be a wasted route. Theres no use of seeing all updates for all of the products
// could be product/update/:id ??? How many levels deep do you want to go max 2??
export const getUpdates = async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = req.user.id as string;
  const products = await prisma.product.findMany({
    where: {
      belongsToId: userId,
    },
    include: { updates: true },
  });
  // error handling
  // "if you have to do this after comming out of a database you're doing it wrong" - Scott Moss
  // huge load on memory
  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);
  res.json({ data: updates });
};

export const getOneUpdate = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.id as string;
  const update = await prisma.update.findFirst({
    where: {
      id: req.params.id,
      product: {
        belongsToId: userId,
      },
    },
  });

  // error handling
  res.json({ data: update });
};

// Need explanantion
export const updateUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const updateId = req.params.id;
  const productId = req.body.productId;
  // how do i only allow updates with the user associated with the content?
  // Mutltiple queries?\
  // @ts-ignore
  const userId = req.user.id as string;
  // implicit check if user owns the product
  let product: { updates: Update[]; id: string };
  try {
    product = await prisma.product.findUnique({
      where: {
        id_belongsToId: { id: productId, belongsToId: userId },
      },
      select: {
        updates: true,
        id: true,
      },
    });
  } catch (err) {
    next(err);
  }
  if (!product) {
    res.json({ data: null });
    return;
  }

  const updatedUpdate = await prisma.update.update({
    where: {
      id_productId: {
        id: updateId,
        productId: product.id,
      },
    },
    data: req.body, // simplify the approach
  });

  // error handling
  res.json({ data: updatedUpdate });
};
export const createUpdate = async (req: Request, res: Response) => {
  // find product of specific user
  // @ts-ignore
  const userId = req.user.id as string;
  // finds product that is tide to the user and product id
  const { title, body, productId } = req.body;
  const product = await prisma.product.findUnique({
    where: {
      id_belongsToId: {
        belongsToId: userId,
        id: req.body.productId,
      },
    },
  });

  // no product check
  if (!product) {
    return res.json({ data: null });
  }

  // Create update for the product
  const update = await prisma.update.create({
    data: {
      title: title as string,
      body: body as string,
      product: { connect: { id: productId as string } },
    },
  });

  res.json({ data: update });
};

// This inidcated that the client will always know the productId
// Is this something not to be coupled with ??
export const deleteUpdate = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.id as string;
  const productId = req.body.productId as string;
  const updateId = req.body.updateId as string;
  // * Find the product associated with the update to see if product is associated with user
  const product = await prisma.product.findUnique({
    where: {
      id_belongsToId: {
        belongsToId: userId,
        id: productId,
      },
    },
    select: {
      updates: true,
      id: true,
    },
  });

  if (!product) {
    return res.json({ data: null });
  }

  const deleteUpdate = await prisma.update.delete({
    where: {
      id_productId: { id: updateId, productId: product.id },
    },
  });
  return res.json({ data: deleteUpdate });
};
