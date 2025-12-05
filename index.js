const express = require('express');
const methodOverride = require('method-override');
require('dotenv').config();

const flash = require('express-flash');
const session = require("express-session");
const bodyParser = require("body-parser");

const routeClient = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

const loginRoute = require("./routes/auth/login.route");
const registerRoute = require("./routes/auth/register.route");
const cartRoute = require("./routes/client/cart.route");

const systemConfig = require('./config/system');

const database = require('./config/database');

database.connect();

const app = express();
const port = process.env.PORT;


// ---------------------- MIDDLEWARE CƠ BẢN ----------------------

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// SESSION
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 30 * 60 * 1000 }
    })
);

// FLASH
app.use(flash());


// ---------------------- GẮN USER CHO VIEW ----------------------

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});


// ---------------------- GIỎ HÀNG MINI ----------------------

app.use((req, res, next) => {
    const cart = req.session.cart || {};
    let totalQty = 0;

    for (let id in cart) {
        totalQty += cart[id].quantity;
    }

    res.locals.cartTotal = totalQty; // ⭐ DÙNG TRONG header.pug
    next();
});


// ---------------------- TEMPLATE + PUBLIC ----------------------

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

app.locals.prefixAdmin = systemConfig.prefixAdmin;


// ---------------------- ROUTES ----------------------

// Auth routes
app.use("/login", loginRoute);
app.use("/register", registerRoute);

// Cart routes (PHẢI đặt trước client route)
app.use("/cart", cartRoute);

// Client + Admin
routeClient(app);
routeAdmin(app);


// ---------------------- RUN SERVER ----------------------

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
