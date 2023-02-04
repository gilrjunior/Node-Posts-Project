//MODULOS
    const express = require('express')
    const app = express()
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const user = require('./routes/user')
    const admin = require('./routes/admin')
    const authentication = require("./routes/authentication")
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
    const passport = require("passport")
    require("./config/auth")(passport)

//CONFIG
//SESSION
    app.use(session({

        secret: "projetonode",
        resave: true,
        saveUninitialized: true

    }))

    app.use(passport.initialize())
    app.use(passport.session())
    
    app.use(flash())
//MIDDLEWARE
    app.use((req, res, next) => {

        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        next()

    })
//HANDLEBARS    
    app.engine('handlebars', handlebars.engine({ defaultLayout: 'main', runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true, }, }))
    app.set('view engine', 'handlebars')  
//BODYPARSER
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
//BOOTSTRAP
    app.use(express.static(path.join(__dirname, 'public')))
//ROTAS

    app.use(user)
    app.use("/usuarios", authentication)
    app.use("/admin", admin)

//OUTROS

const port = 8000

app.listen(port, () => {

    console.log('Servidor ativo...')    

})