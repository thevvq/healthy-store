const User = require("../../models/user.model");
const bcrypt = require("bcrypt");

module.exports = {
    login: async (email, password) => {
        const user = await User.findOne({ email: email });

        if (!user) return null;

        const match = await bcrypt.compare(password, user.password);

        if (!match) return null;

        return user;
    }
};
