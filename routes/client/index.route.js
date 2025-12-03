const productRoutes = require('./product.route')
const homeRoutes = require('./home.route')
const blogRoutes = require("./blog.route")
const profileRoutes = require("./profile.route")

module.exports = (app) => {
    app.use("/profile", profileRoutes)
    app.use('/', homeRoutes)
    app.use('/', productRoutes)
    app.use("/blog", blogRoutes)
}
