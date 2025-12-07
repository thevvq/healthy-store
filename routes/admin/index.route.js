const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const blogRoutes = require('./blog.route');  
const categoryRoutes = require('./category.route'); 

const systemConfig = require('../../config/system');

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + '/dashboard', dashboardRoutes);

    app.use(PATH_ADMIN + '/products', productRoutes);

    app.use(PATH_ADMIN + '/blog', blogRoutes);

    app.use(PATH_ADMIN + '/categories', categoryRoutes)
};
