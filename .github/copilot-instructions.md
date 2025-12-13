# Copilot / AI Agent Instructions

This repo is an Express.js + Pug web app backed by MongoDB (Mongoose). The goal of this file is to give AI coding agents the minimal, concrete context they need to be productive.

1) Big-picture architecture
- Server: `index.js` — sets up Express, sessions, flash, static files, global `res.locals`, mounts client and admin routes.
- Routing: `routes/client/*` and `routes/admin/*` register sub-routers. See `routes/client/index.route.js` for an example of a global middleware that injects `categoriesMenu`.
- Controllers → Services → Models: controllers in `controllers/**` call services in `services/**`, services operate on Mongoose models in `models/*.model.js`.
- Views: Pug templates live in `views/` (split `admin` / `client`). Static assets are in `public/`.

2) Key runtime & dev workflows
- Start server locally: `npm start` (runs `nodemon --inspect index.js` from `package.json`).
- Environment: expects `.env` with at least `MONGO_URL`, `SESSION_SECRET`, `TINYMCE_API_KEY`, `CLOUDINARY_*` keys. DB connects in `config/database.js`.

3) Patterns & conventions specific to this project
- Session-auth: authenticated user stored at `req.session.user`; templates can access `res.locals.user` (set in `index.js`).
- Mini-cart: `index.js` populates `res.locals.cartTotal` from `models/cart.model.js` for layouts — be careful when changing cart logic.
- Route protection: client middleware `middlewares/client/checkLogin.middleware.js` guards routes like `/cart`, `/checkout`, `/orders` (see `routes/client/index.route.js`).
- API response shape: many client API endpoints return JSON `{ success: boolean, message: string, ... }` (see `controllers/client/cart.controller.js`). Keep this shape when adding similar endpoints.
- Controller responsibilities: thin — gather request data, call service, handle response/render. Services implement business rules and DB access (e.g., `services/client/cart.service.js`). Follow this split.

4) Integration points & external services
- Cloudinary: configured in `config/cloudinary.js`; helper `helper/uploadCloud.js` uploads and removes local temp files.
- File uploads: use `config/multer.js` (writes to `/temp`) then upload helper to send to Cloudinary.
- Email: `nodemailer` is present in `package.json` if needed by controllers/services.

5) Files to check for examples when making changes
- Route + middleware example: [routes/client/index.route.js](routes/client/index.route.js)
- Controller → Service example: [controllers/client/cart.controller.js](controllers/client/cart.controller.js) and [services/client/cart.service.js](services/client/cart.service.js)
- Model example: [models/cart.model.js](models/cart.model.js) and [models/product.model.js](models/product.model.js)
- App bootstrap and global locals: [index.js](index.js)
- Upload flow: [config/multer.js](config/multer.js) and [helper/uploadCloud.js](helper/uploadCloud.js)

6) Things AI agents should avoid changing without explicit instruction
- Global session/res.locals behavior in `index.js` (affects templates and many routes).
- Category injection middleware in `routes/client/index.route.js` — changing DB calls here affects client navigation and templates.
- Data models (`models/*.model.js`) structure changes require migration and are breaking.

7) Useful quick examples
- Add a new client route: add `routes/client/foo.route.js`, create `controllers/client/foo.controller.js` (thin controller calling a new `services/client/foo.service.js`), then mount it in `routes/client/index.route.js`.
- Return JSON API: follow `{ success: true|false, message: '…' }` pattern and appropriate HTTP status codes when adding endpoints.

If anything here is unclear or you want additional examples (tests, CI, or a sample change), tell me which area to expand. 
