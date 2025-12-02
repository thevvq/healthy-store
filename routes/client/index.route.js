const productRoutes = require('./product.route');
const homeRoutes = require('./home.route');
const blogRoutes = require('./blog.route');   

module.exports = (app) => {
    app.use('/', homeRoutes);
    app.use('/', productRoutes);
    app.use('/blog', blogRoutes);
};
