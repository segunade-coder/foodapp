import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getProductById,
  getProducts,
  getProductsById,
} from "../controllers/products";
import { upload } from "../configs/configOptions";
import {
  createCategory,
  deleteCategory,
  editCategory,
  getCategories,
} from "../controllers/categories";
import {
  createBlog,
  deleteBlog,
  editBlog,
  getBlogById,
  getBlogs,
} from "../controllers/blogs";
import { userLogin, userLogout } from "../controllers/auth";
import {
  addGallery,
  contactus,
  dashboardOverview,
  getGallery,
  getNotifications,
  mailer,
  passwordReset,
} from "../controllers/others";
import { checkAuth } from "../middlewares/auth";
import {
  addOrder,
  getOrders,
  getSingleOrder,
  updateSingleOrder,
} from "../controllers/orders";

const router = Router();

router.post("/login", userLogin);
router.get("/overview", checkAuth, dashboardOverview);
router
  .route("/categories")
  .get(getCategories)
  .post(checkAuth, createCategory)
  .patch(checkAuth, editCategory)
  .delete(checkAuth, deleteCategory);
router
  .route("/products")
  .get(getProducts)
  .post(checkAuth, upload.single("image"), createProduct)
  .patch(checkAuth, upload.single("image"), editProduct)
  .delete(checkAuth, deleteProduct);
router.get("/product/:category", getProductById);
router.post("/products/find", getProductsById);
router
  .route("/blogs")
  .get(getBlogs)
  .post(checkAuth, upload.single("image"), createBlog)
  .patch(checkAuth, upload.single("image"), editBlog)
  .delete(checkAuth, deleteBlog);
router.get("/blog/:id", getBlogById);
router.route("/orders").get(checkAuth, getOrders).post(addOrder);
router.route("/order/:id").get(getSingleOrder).patch(updateSingleOrder);
router.get("/notifications", checkAuth, getNotifications);
router.patch("/password-reset", checkAuth, passwordReset);
router.post("/mailer", checkAuth, mailer);
router.post("/contact", contactus);
router
  .route("/gallery")
  .post(checkAuth, upload.array("images"), addGallery)
  .get(getGallery);
router.get("/logout", checkAuth, userLogout);
export default router;
