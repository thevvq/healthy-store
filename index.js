const express = require('express');
const methodOverride = require('method-override');
require('dotenv').config();

const flash = require('express-flash');

const session = require("express-session");
const bodyParser = require("body-parser");

const routeClient = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

const loginRoute = require("./routes/login.route");

const systemConfig = require('./config/system');

const database = require('./config/database');
database.connect();

const app = express();
const port = process.env.PORT;

// Override method
app.use(methodOverride('_method'));

// Body parser để đọc form POST
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

// Gắn user vào view
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

// Login route
app.use("/login", loginRoute);

// Client & Admin routes
routeClient(app);
routeAdmin(app);

// Server start
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
