const express = require('express');
const methodOverride = require('method-override');
require('dotenv').config();

const session = require("express-session");
const bodyParser = require("body-parser");

const routeClient = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

// Route login mới thêm
const loginRoute = require("./routes/login.route");

const systemConfig = require('./config/system');

const database = require('./config/database');
database.connect();

const app = express();
const port = process.env.PORT;

// Override method
app.use(methodOverride('_method'));

// Body parser để đọc form POST (bắt buộc cho đăng nhập)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Bật session (QUAN TRỌNG)
app.use(session({
    secret: "my-login-secret",
    resave: false,
    saveUninitialized: true
}));

// ⭐⭐ CHÈN CODE MỚI TẠI ĐÂY — TRUYỀN USER VÀO VIEW ⭐⭐
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// View engine
app.set('views', './views');
app.set('view engine', 'pug');

// Public folder
app.use(express.static('public'));

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Gắn route login (phải đặt trước client/admin)
app.use("/login", loginRoute);

// Routes
routeClient(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
