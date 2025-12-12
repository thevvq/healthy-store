const bcrypt = require("bcrypt");
const User = require("../../models/user-client");

module.exports.register = async ({ fullName, email, password }) => {
    const exist = await User.findOne({ email });
    if (exist) {
        throw new Error("EMAIL_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        fullName,
        email,
        password: hashedPassword
    });
};
