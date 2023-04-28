import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "./modules/middleware";
import {
  createProduct,
  deleteProduct,
  getOneProduct,
  getProducts,
  updateProduct,
} from "./handlers/product";
import {
  createUpdate,
  deleteUpdate,
  getOneUpdate,
  getUpdates,
  updateUpdate,
} from "./handlers/update";
/**
 * use body to enfore key value pairs to enhance request object
 * example body('name') will enforce req.body to have a property name with a value attached to it
 * look at documntation. It is a good looking validation library
 * Abstract input validations. Put in own module
 */

const router = Router();

// PUT vs Patch
// PUT updates all fields except id
// Patch updates selected fields
/**
 * handlers should handle their method
 * Dont do validation logic in handler
 */

/**
 * Product
 */
router.get("/product", getProducts);
router.get("/product/:id", getOneProduct);

router.put(
  "/product/:id",
  body("name").exists().isString(),
  handleInputErrors,
  updateProduct
);

router.post(
  "/product",
  body(["name"]).exists().isString(),
  handleInputErrors,
  createProduct
);
router.delete("/product/:id", deleteProduct);

/**
 * Update
 */
router.get("/update", getUpdates);
router.get("/update/:id", getOneUpdate);
router.put(
  "/update/:id",
  body(["title", "body", "asset", "version"]).optional().isString().trim(),
  body("status")
    .optional()
    .trim()
    .isIn(["IN_PROGRESS", "SHIPPED", "DEPRECATED"]),
  body("productId").exists().isString().trim(),
  handleInputErrors,
  updateUpdate
);
router.post(
  "/update",
  body(["title", "body", "productId"]).exists().isString().trim(),
  body(["version"]).optional().isString().trim(),
  handleInputErrors,
  createUpdate
);
// add an id params to this and it will be easier
router.delete(
  "/update",
  body(["productId", "updateId"]).exists().isString().trim(),
  handleInputErrors,
  deleteUpdate
);

/**
 * Update Points
 */
router.get("/update-point", () => {});
router.get("/update-point/:id", () => {});
router.put(
  "/update-point/:id",
  body(["name", "description"]).optional().isString().trim(),
  handleInputErrors
);
router.post(
  "/update-point/",
  body(["name", "description"]).exists().isString().trim(),
  handleInputErrors
);
router.delete(
  "/update-point/",
  body(["name"]).exists().isString().trim(),
  handleInputErrors
);

export default router;
