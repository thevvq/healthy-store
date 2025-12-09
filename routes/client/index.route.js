const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");
const blogRoutes = require("./blog.route");
const profileRoutes = require("./profile.route");
const cartRoutes = require("./cart.route");
const loginRoute = require("../auth/login.route");
const registerRoute = require("../auth/register.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");
const ordersRoute = require("./orders.route");

module.exports = (app) => {
   
    app.use("/profile", profileRoutes);

    app.use("/cart", cartRoutes);
    
    app.use("/blog", blogRoutes);

    app.use("/", productRoutes);
    
    app.use("/", homeRoutes);

    app.use("/login", loginRoute);

    app.use("/register", registerRoute);
    
    app.use("/cart", cartRoute);

    app.use("/checkout", checkoutRoute);

    app.use("/orders", ordersRoute);
};
