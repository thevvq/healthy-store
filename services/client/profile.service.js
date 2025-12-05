const User = require("../../models/user.model");
const uploadToCloud = require("../../helper/uploadCloud");

// KIỂM TRA LOGIN 
module.exports.checkLogin = (sessionUser) => {
    return !!sessionUser;
};

// CHUẨN BỊ DATA UPDATE
module.exports.prepareUpdateData = async (req) => {
    const currentUser = req.session.user;

    let avatar = currentUser.avatar || null;

    // Nếu có upload file → đưa lên cloud
    if (req.file) {
        const uploadResult = await uploadToCloud(req.file.path);
        avatar = uploadResult.secure_url;
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

// UPDATE USER
module.exports.updateUserInDatabase = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { new: true });
};
