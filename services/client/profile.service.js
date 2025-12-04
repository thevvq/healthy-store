const User = require("../../models/user.model");

//  KIỂM TRA LOGIN 
module.exports.checkLogin = (sessionUser) => {
    return !!sessionUser;
};

// CHUẨN BỊ DATA UPDATE
module.exports.prepareUpdateData = (req) => {
    const currentUser = req.session.user;

    let avatar = currentUser.avatar || null;
    if (req.file) {
        avatar = "/uploads/avatar/" + req.file.filename;
    }

    return {
        id: currentUser._id,
        data: {
            fullName: req.body.fullName,
            gender: req.body.gender,
            birthday: req.body.birthday || null,
            phone: req.body.phone,
            address: req.body.address,
            avatar
        }
    };
};

// UPDATE USER DB 
module.exports.updateUserInDatabase = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { new: true });
};
