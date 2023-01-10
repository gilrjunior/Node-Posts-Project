//MODULOS
    const express = require('express')
    const app = express()
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const admin = require('./routes/admin')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')

//CONFIG
//SESSION
    app.use(session({

        secret: "projetonode",
        resave: true,
        saveUninitialized: true

    }))
    app.use(flash())
//MIDDLEWARE
    app.use((req, res, next) => {

        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next();

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

    app.use('/admin',admin)


//OUTROS
const port = 8000

app.listen(port, () => {

    console.log('Servidor ativo...')    

})