const express = require("express")
const router = express.Router()
const user = require("../models/userSchema")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const { Passport } = require("passport/lib")

router.get("/registro", (req, res) => {

    res.render("usuarios/registro")

})

router.post("/registro", (req, res) => {

    var erro = []

    if(req.body.password != req.body.password2){

        erro.push({text: "As senhas informadas não são iguais, por favor informe novamente!"})
        res.render("usuarios/registro", {erro: erro, name: req.body.name, email: req.body.email})

    }else if(req.body.password.length < 5){
    
        erro.push({text: "A senha informada é muito curta!"})
        res.render("usuarios/registro", {erro: erro, name: req.body.name, email: req.body.email})

    }else{

        user.findOne({email: req.body.email}).then((account) => {

            if(account){

                req.flash("error_msg", "Já existe uma conta registrada com o email informado!")
                res.redirect("/usuarios/registro")

            }else{

                const newUser = new user({

                    name: req.body.name,
                    password: req.body.password,
                    email: req.body.email

                })

                bcrypt.genSalt(10, (erro, salt) => {

                    bcrypt.hash(newUser.password, salt, (erro, hash) => {

                        if(erro){

                            req.flash("error_msg", "Houve um erro ao registrar o usuário!")
                            res.redirect("/usuarios/registro")

                        }
                        
                        newUser.password = hash

                        newUser.save().then(() => {

                            req.flash("success_msg", "Usuário registrado com sucesso!")
                            res.redirect("/")

                        }).catch((err) => {

                            req.flash("error_msg", "Houve um erro ao registrar o usuário!")
                            res.redirect("/usuarios/registro")

                        })

                    })

                })

                
            }


        }).catch((err) =>{

            req.flash("error_msg", "Houve um erro ao registrar o usuário!")
            res.redirect("/usuarios/registro")

        })

    }

})

router.get("/login", (req, res) => {

    res.render("usuarios/login")

})

router.post('/login', passport.authenticate('local', {failureRedirect: '/usuarios/login', failureFlash: true}), function(req, res) {
    req.flash("success_msg","Usuario logado com sucesso!")
    res.redirect("/")
})


module.exports = router