const Product = require('../../models/product.model')
const filterStatusHelper = require('../../helper/filterStatus')
const searchHelper = require('../../helper/search')
const paginationHelper = require('../../helper/pagination')

module.exports.getList = async (query) => {

    const filterStatus = filterStatusHelper(query)
    const find = { deleted: false }

    if (query.status) find.status = query.status

    const searchObject = searchHelper(query)
    if(searchObject.regex) find.title = searchObject.regex

    // Pagination
    const countProducts = await Product.countDocuments(find)
    const pagination = paginationHelper({
        currentPage: 1,
        limitItems: 6
    }, query, countProducts)

    const products = await Product
        .find(find)
        .sort({ position: 1 })
        .limit(pagination.limitItems)
        .skip(pagination.skip)

    return {
        products,
        filterStatus,
        keyword: searchObject.keyword,
        pagination
    }
}

module.exports.changeStatus = async (id, status) => {
    return await Product.updateOne(
        { _id: id },
        { status }
    )
}

module.exports.changeMulti = async (req, type, ids) => {
    const statusMap = {
        active: 'active',
        inactive: 'inactive',
        'delete-all': 'delete-all',
        'change-position': 'change-position'
    }

    const status = statusMap[type]
    if (!status) return

    if (status === 'delete-all') {
        await Product.updateMany(
            { _id: { $in: ids }},
            { 
                deleted: true,
                deletedAt: new Date()
            }  
        )
        req.flash('success', `Xóa thành công ${ids.length} sản phẩm!`)
        return
    }

    if (status === 'change-position') {
        for (const item of ids) {
            let[id, position] = item.split('-');
            position = parseInt(position);
            await Product.updateOne(
                { _id: id },
                { position }
            )
        }
        req.flash('success', `Cập nhật vị trí thành công ${ids.length} sản phẩm!`)

        return 
    }

    await Product.updateMany(
        { _id: { $in: ids } },
        { status }
    )
    req.flash('success', `Cập nhật thành công ${ids.length} sản phẩm!`)
}

module.exports.deleteProduct = async (id) => {
    // return await Product.deleteOne(
    //     { _id: id }
    // )

    return await Product.updateOne(
        { _id: id },
        { 
            deleted: true,
            deletedAt: new Date()
        }
    )
}

module.exports.createProduct = async (req) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position === '') {
        const countProducts = await Product.countDocuments({ deleted: false });
        
        req.body.position = countProducts + 1;
    }else {
        req.body.position = parseInt(req.body.position);
    }
    
    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    const product = new Product(req.body);
    return await product.save();
}

module.exports.edit= async (id)=> {
    return await Product.findOne({
        deleted: false,
        _id: id
    })
}

module.exports.editProduct = async (req, id) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.body.removeThumbnail === "1") {
        req.body.thumbnail = '';
    } else if (req.file) {
        req.body.thumbnail = '/uploads/' + req.file.filename;
    }

    return await Product.updateOne(
        { _id: id },
        req.body
    );
}

module.exports.detail = async (id) => {
    return await Product.findOne({
        deleted: false,
        _id: id
    })
}
