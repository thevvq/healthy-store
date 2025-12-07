const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const blogRoutes = require('./blog.route');  
const categoryRoutes = require('./category.route');
const roleRoutes = require('./role.route');
const orderAdminRoutes = require('./orders.route');   // ⭐ thêm route orders admin

const systemConfig = require('../../config/system');

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin; // "/admin"

    app.use(PATH_ADMIN + '/dashboard', dashboardRoutes);

    app.use(PATH_ADMIN + '/products', productRoutes);

    app.use(PATH_ADMIN + '/blog', blogRoutes);

    app.use(PATH_ADMIN + '/categories', categoryRoutes);

    app.use(PATH_ADMIN + '/roles', roleRoutes);

    // ⭐ Thêm phần quản lý đơn hàng trong admin
    app.use(PATH_ADMIN + '/orders', orderAdminRoutes);
};
