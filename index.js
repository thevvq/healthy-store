const express = require('express');
const methodOverride = require('method-override');
require('dotenv').config();
const path = require('path');

const flash = require('express-flash');

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


// Session login
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 30 * 60 * 1000 }
    })
);

// Flash message
app.use(flash());

// ⭐ GẮN USER CHO VIEW
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// tinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.locals.tinyMceKey = process.env.TINYMCE_API_KEY

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
