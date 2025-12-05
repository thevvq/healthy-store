const Product = require('../../models/product.model')

module.exports.getList = async () => {
    const products = await Product.find({
        status: 'active',
        deleted: false
    })
    .sort({ position: 1 })

    const newProducts = products.map(item => {
        item.newPrice = (item.price * (100 - item.discountPercentage) / 100).toFixed(0)
        return item
    })

    return newProducts
}

module.exports.detail = async (slug) => {
    const product =  await Product.findOne({
        deleted: false,
        slug: slug,
        status: 'active'
    })
    
    product.newPrice = (product.price * (100 - product.discountPercentage) / 100).toFixed(0)
    
    return product
}