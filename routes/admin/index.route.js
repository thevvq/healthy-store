const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const blogRoutes = require('./blog.route');  
const categoryRoutes = require('./category.route');
const roleRoutes = require('./role.route');
const accountRoutes = require('./account.route');
const orderAdminRoutes = require('./orders.route');
const authRoutes = require('./auth.route');

const systemConfig = require('../../config/system');

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin; // "/admin"

    app.use(PATH_ADMIN + '/dashboard', dashboardRoutes);

    app.use(PATH_ADMIN + '/products', productRoutes);

    app.use(PATH_ADMIN + '/blog', blogRoutes);

    app.use(PATH_ADMIN + '/categories', categoryRoutes);

    app.use(PATH_ADMIN + '/roles', roleRoutes);

    app.use(PATH_ADMIN + '/accounts', accountRoutes);

    app.use(PATH_ADMIN + '/orders', orderAdminRoutes);

    app.use(PATH_ADMIN + '/auth', authRoutes);
    
};
