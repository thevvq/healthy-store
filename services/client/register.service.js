const bcrypt = require("bcrypt");
const User = require("../../models/user.model");

module.exports.register = async (data) => {
    const { fullName, email, password, confirmPassword } = data;

    // Validate
    if (!fullName || !email || !password || !confirmPassword) {
        return { error: "Vui lòng nhập đầy đủ thông tin!" };
    }

    if (password !== confirmPassword) {
        return { error: "Mật khẩu nhập lại không khớp!" };
    }

    // Kiểm tra email tồn tại
    const exist = await User.findOne({ email });
    if (exist) {
        return { error: "Email đã tồn tại!" };
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu user
    await User.create({
        fullName,
        email,
        password: hashedPassword
    });

    return { success: true };
};
