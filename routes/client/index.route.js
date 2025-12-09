const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");
const blogRoutes = require("./blog.route");
const profileRoutes = require("./profile.route");
const cartRoutes = require("./cart.route");

// 👇 THÊM: service lấy danh mục
const categoryService = require("../../services/client/category.service");

module.exports = (app) => {
    // 👇 Middleware dùng cho TẤT CẢ route client
    app.use(async (req, res, next) => {
        try {
            const categoriesMenu = await categoryService.getCategoriesMenu();
            // biến này dùng được trong mọi file pug (res.locals)
            res.locals.categoriesMenu = categoriesMenu;
        } catch (error) {
            console.log("Load categories menu error:", error);
            res.locals.categoriesMenu = [];
        }
        next();
    });

    app.use("/profile", profileRoutes);

    app.use("/cart", cartRoutes);

    app.use("/blog", blogRoutes);

    app.use("/", productRoutes);

    app.use("/", homeRoutes);
};
