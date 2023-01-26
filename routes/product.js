const express = require("express");
const router = express.Router();
const {
  create,
  read,
  update,
  remove,
  list,
  listRelated,
  listCatagories,
  listBySearch,
  productById,
  photo,
} = require("../controllers/product");
const { userById } = require("../controllers/user");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

// Routes

router.get("/product/:productId", read);
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.put(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);
router.get("/products", list);
router.get("/products/related/:productId", listRelated);
router.get("/products/catagories", listCatagories);
router.get("/product/photo/:productId", photo);
router.post("/products/by/search", listBySearch);

router.param("userId", userById);
router.param("productId", productById);
module.exports = router;
