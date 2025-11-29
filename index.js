const express = require('express')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
require('dotenv').config()

const routeClient = require('./routes/client/index.route')
const routeAdmin = require('./routes/admin/index.route')

const systemConfig = require('./config/system')

const database = require('./config/database')
database.connect()

const app = express()
const port = process.env.PORT

app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.static('public'))

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

//Routes
routeClient(app)
routeAdmin(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
