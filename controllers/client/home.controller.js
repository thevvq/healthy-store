const productService = require('../../services/client/product.service');
const categoryService = require('../../services/client/category.service');

// [GET] /
module.exports.index = async (req, res) => {
    try {
        const [productsHome, categoriesMenu] = await Promise.all([
            productService.getProductsForHome(12),
            categoryService.getMenuCategories()
        ]);

        res.render('client/pages/home/index', {
            pageTitle: 'Trang chủ',
            productsHome,
            categoriesMenu
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
};
