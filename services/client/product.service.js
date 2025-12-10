const Product = require('../../models/product.model')
const Category = require('../../models/category.model')

const getList = async () => {
    const products = await Product.find({
        status: 'active',
        deleted: false
    })
    .sort({ position: 1 })

    const newProducts = products.map(item => {
        item.newPrice = (item.price * (100 - item.discountPercentage) / 100).toFixed(2)
        return item
    })

    return newProducts
}

module.exports.getList = getList

// ✅ Thêm hàm này dùng riêng cho trang home
module.exports.getProductsForHome = async (limit = 10) => {
    const products = await getList()
    return products.slice(0, limit)      // lấy 10 sp đầu (hoặc theo limit truyền vào)
}

module.exports.detail = async (slug) => {
    const product =  await Product.findOne({
        deleted: false,
        slug: slug,
        status: 'active'
    })
    
    product.newPrice = (product.price * (100 - product.discountPercentage) / 100).toFixed(2)
    
    return product
}

// ✅ Lấy sản phẩm theo slug danh mục (cha hoặc con)
module.exports.getListByCategorySlug = async (slug) => {
  // 1. Tìm danh mục theo slug
    const category = await Category.findOne({
        slug,
        deleted: false,
        status: 'active'
    })

    if (!category) {
        return []
    }

  // 2. Danh sách id danh mục cần lấy (String)
    const categoryIds = [category._id.toString()]

  // 3. Nếu là danh mục CHA (parent_category rỗng) => gom luôn danh mục CON
    if (!category.parent_category) {
        const children = await Category.find({
            parent_category: category._id.toString(),
            deleted: false,
            status: 'active'
        })
        children.forEach(child => {
            categoryIds.push(child._id.toString())
        })
    }

  // 4. Lấy sản phẩm thuộc các danh mục trên
    const products = await Product.find({
        product_category: { $in: categoryIds },
        status: 'active',
        deleted: false
    }).sort({ position: 1 })
  // 5. Tính newPrice giống getList()
    const newProducts = products.map(item => {
        item.newPrice = (item.price * (100 - item.discountPercentage) / 100).toFixed(2)
        return item
    })

    return newProducts
}
