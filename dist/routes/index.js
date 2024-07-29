"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = require("../controllers/products");
const configOptions_1 = require("../configs/configOptions");
const categories_1 = require("../controllers/categories");
const blogs_1 = require("../controllers/blogs");
const auth_1 = require("../controllers/auth");
const others_1 = require("../controllers/others");
const auth_2 = require("../middlewares/auth");
const orders_1 = require("../controllers/orders");
const router = (0, express_1.Router)();
router.post("/login", auth_1.userLogin);
router.get("/overview", auth_2.checkAuth, others_1.dashboardOverview);
router
    .route("/categories")
    .get(categories_1.getCategories)
    .post(auth_2.checkAuth, categories_1.createCategory)
    .patch(auth_2.checkAuth, categories_1.editCategory)
    .delete(auth_2.checkAuth, categories_1.deleteCategory);
router
    .route("/products")
    .get(products_1.getProducts)
    .post(auth_2.checkAuth, configOptions_1.upload.single("image"), products_1.createProduct)
    .patch(auth_2.checkAuth, configOptions_1.upload.single("image"), products_1.editProduct)
    .delete(auth_2.checkAuth, products_1.deleteProduct);
router.get("/product/:category", products_1.getProductById);
router.post("/products/find", products_1.getProductsById);
router
    .route("/blogs")
    .get(blogs_1.getBlogs)
    .post(auth_2.checkAuth, configOptions_1.upload.single("image"), blogs_1.createBlog)
    .patch(auth_2.checkAuth, configOptions_1.upload.single("image"), blogs_1.editBlog)
    .delete(auth_2.checkAuth, blogs_1.deleteBlog);
router.get("/blog/:id", blogs_1.getBlogById);
router.route("/orders").get(auth_2.checkAuth, orders_1.getOrders).post(orders_1.addOrder);
router.route("/order/:id").get(orders_1.getSingleOrder).patch(orders_1.updateSingleOrder);
router.get("/notifications", auth_2.checkAuth, others_1.getNotifications);
router.patch("/password-reset", auth_2.checkAuth, others_1.passwordReset);
router.post("/mailer", auth_2.checkAuth, others_1.mailer);
router.post("/contact", others_1.contactus);
router
    .route("/gallery")
    .post(auth_2.checkAuth, configOptions_1.upload.array("images"), others_1.addGallery)
    .get(others_1.getGallery);
router.get("/logout", auth_2.checkAuth, auth_1.userLogout);
exports.default = router;
