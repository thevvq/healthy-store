const Product = require('../../models/product.model');
const Category = require('../../models/category.model');

// helper format tiền VND
const formatVND = (value) => {
    return value.toLocaleString("vi-VN") + "";
};

const getList = async () => {
    const products = await Product.find({
        status: 'active',
        deleted: false
    }).sort({ position: 1 });

    const newProducts = products.map(item => {
        const newPriceNumber = Math.round(
            item.price * (100 - item.discountPercentage) / 100
        );

        item.newPrice = formatVND(newPriceNumber);   // 👉 VND
        item.oldPrice = formatVND(item.price);       // 👉 giá gốc (nếu cần)

        return item;
    });

    return newProducts;
};

module.exports.getList = getList;

// ✅ Dùng cho trang home
module.exports.getProductsForHome = async (limit = 10) => {
    const products = await getList();
    return products.slice(0, limit);
};

module.exports.detail = async (slug) => {
    const product = await Product.findOne({
        deleted: false,
        slug: slug,
        status: 'active'
    });

    if (!product) return null;

    const newPriceNumber = Math.round(
        product.price * (100 - product.discountPercentage) / 100
    );

    product.newPrice = formatVND(newPriceNumber);
    product.oldPrice = formatVND(product.price);

    return product;
};

// ✅ Lấy sản phẩm theo slug danh mục (cha hoặc con)
module.exports.getListByCategorySlug = async (slug) => {
    // 1. Tìm danh mục
    const category = await Category.findOne({
        slug,
        deleted: false,
        status: 'active'
    });

    if (!category) return [];

    // 2. Gom id danh mục
    const categoryIds = [category._id.toString()];

    // 3. Nếu là danh mục CHA → lấy luôn CON
    if (!category.parent_category) {
        const children = await Category.find({
            parent_category: category._id.toString(),
            deleted: false,
            status: 'active'
        });

        children.forEach(child => {
            categoryIds.push(child._id.toString());
        });
    }

    // 4. Lấy sản phẩm
    const products = await Product.find({
        product_category: { $in: categoryIds },
        status: 'active',
        deleted: false
    }).sort({ position: 1 });

    // 5. Tính giá VND
    const newProducts = products.map(item => {
        const newPriceNumber = Math.round(
            item.price * (100 - item.discountPercentage) / 100
        );

        item.newPrice = formatVND(newPriceNumber);
        item.oldPrice = formatVND(item.price);

        return item;
    });

    return newProducts;
};
