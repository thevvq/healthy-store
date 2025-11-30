const express = require('express');
const methodOverride = require('method-override');
require('dotenv').config();

const session = require("express-session");
const bodyParser = require("body-parser");

const routeClient = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

const loginRoute = require("./routes/auth/login.route");
const registerRoute = require("./routes/auth/register.route");

const systemConfig = require('./config/system');

const database = require('./config/database');
database.connect();

const app = express();
const port = process.env.PORT;

// Override method
app.use(methodOverride('_method'));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ⭐ BẬT SESSION SỚM NHẤT
app.use(session({
    secret: "my-login-secret",
    resave: false,
    saveUninitialized: true
}));

// ⭐ GẮN USER CHO VIEW
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Pug template
app.set('views', './views');
app.set('view engine', 'pug');

// Public files
app.use(express.static('public'));

// Admin prefix
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// ⭐ GẮN ROUTE AUTH TRƯỚC ROUTE CLIENT/ADMIN
app.use("/login", loginRoute);
app.use("/register", registerRoute);

// ⭐ SAU ĐÓ MỚI GẮN ROUTE CLIENT/ADMIN
routeClient(app);
routeAdmin(app);

// Start server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
