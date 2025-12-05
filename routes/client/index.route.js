const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");
const blogRoutes = require("./blog.route");
const profileRoutes = require("./profile.route");
const cartRoutes = require("./cart.route"); 

module.exports = (app) => {

   
    app.use("/profile", profileRoutes);

   
    app.use("/cart", cartRoutes);

    
    app.use("/blog", blogRoutes);

    app.use("/", productRoutes);

    
    app.use("/", homeRoutes);
};
