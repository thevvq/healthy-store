const Product = require('../../models/product.model')

module.exports.getList = async () => {
    const products = await Product.find({
        status: 'active',
        deleted: false
    })

    const newProducts = products.map(item => {
        return {
            ...item.toObject(),
            newPrice: Math.round(item.price * (100 - item.discountPercentage) / 100)
        }
    })

    return newProducts
}
