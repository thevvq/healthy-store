const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Models
const Role = require('../models/role.model');
const User = require('../models/user.model');

const seedAdmin = async () => {
    try {
        if (!process.env.MONGO_URL) {
            console.error("Error: MONGO_URL is not defined in .env file.");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URL);
        console.log("Kết nối Database thành công!");

        // 1. Tạo nhóm quyền Quản trị viên cao nhất
        const permissions = [
            'products_view', 'products_create', 'products_edit', 'products_delete',
            'categories_view', 'categories_create', 'categories_edit', 'categories_delete',
            'roles_view', 'roles_create', 'roles_edit', 'roles_delete', 'roles_permissions',
            'accounts_view', 'accounts_create', 'accounts_edit', 'accounts_delete',
            'blogs_view', 'blogs_create', 'blogs_edit', 'blogs_delete',
            'orders_view', 'orders_edit'
        ];

        let adminRole = await Role.findOne({ title: "Super Admin", deleted: false });

        if (!adminRole) {
            adminRole = new Role({
                title: "Super Admin",
                description: "Quản trị viên cấp cao nhất với toàn quyền hệ thống",
                permissions: permissions
            });
            await adminRole.save();
            console.log("Đã tạo nhóm quyền Super Admin!");
        } else {
            console.log("Nhóm quyền Super Admin đã tồn tại. Đang cập nhật lại phân quyền...");
            adminRole.permissions = permissions;
            await adminRole.save();
        }

        // 2. Tạo tài khoản Admin
        const adminEmail = "verdish@gmail.com";
        const adminPassword = "verdishAdmin";

        const existingAdmin = await User.findOne({ email: adminEmail, deleted: false });

        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            const newAdmin = new User({
                fullName: "Quản trị viên Super Admin",
                email: adminEmail,
                password: hashedPassword,
                role_id: adminRole._id.toString(),
                status: "active",
                phone: "0123456789"
            });

            await newAdmin.save();
            console.log(`Đã tạo tài khoản Admin thành công!`);
            console.log(`Email đăng nhập: ${adminEmail}`);
            console.log(`Mật khẩu: ${adminPassword}`);
        } else {
            console.log(`Tài khoản Admin với email ${adminEmail} đã tồn tại.`);
            console.log(`Đang gán lại quyền Super Admin cho tài khoản...`);
            existingAdmin.role_id = adminRole._id.toString();
            await existingAdmin.save();
            console.log(`Gán quyền hoàn tất!`);
        }

        console.log("Thực thi Seed thành công!");
        process.exit(0);
    } catch (error) {
        console.error("Lỗi khi chạy Seed: ", error);
        process.exit(1);
    }
};

module.exports = seedAdmin
