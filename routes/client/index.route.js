const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");
const blogRoutes = require("./blog.route");
const profileRoutes = require("./profile.route");
const loginRoute = require("./login.route");
const registerRoute = require("./register.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");
const ordersRoute = require("./orders.route");
const passwordRoute = require("./password.route");

const middlewareCheckLogin = require("../../middlewares/client/checkLogin.middleware");
// 👇 THÊM: service lấy danh mục
const categoryService = require("../../services/client/category.service");

module.exports = (app) => {
    // 👇 Middleware dùng cho TẤT CẢ route client
    app.use(async (req, res, next) => {
        try {
            const categoriesMenu = await categoryService.getMenuCategories();
            // biến này dùng được trong mọi file pug (res.locals)
            res.locals.categoriesMenu = categoriesMenu;
        } catch (error) {
            console.log("Load categories menu error:", error);
            res.locals.categoriesMenu = [];
        }
        next();
    });

    app.use("/profile", middlewareCheckLogin.requireAuthClient, profileRoutes);

    app.use("/blog", blogRoutes);

    app.use("/", productRoutes);

    app.use("/", homeRoutes);

    app.use("/login", loginRoute);

    app.use("/password", passwordRoute);

    app.use("/register", registerRoute);
    
    app.use("/cart", middlewareCheckLogin.requireAuthClient, cartRoute);

    app.use("/checkout", middlewareCheckLogin.requireAuthClient, checkoutRoute);

    app.use("/orders", middlewareCheckLogin.requireAuthClient, ordersRoute);
};
