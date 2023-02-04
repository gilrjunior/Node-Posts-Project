const localStrategy = require("passport-local").Strategy
const bcryypt = require("bcryptjs")
const user = require("../models/userSchema")

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email', passwordField: "password"}, (email, password, done) => {


       user.findOne({email: email}).then((usuario) => {

            if(!usuario){

                return done(null, false, {message: "Esta conta não existe!"})

            }

            bcryypt.compare(password, usuario.password, (erro, result) =>{

                if(result){

                    return done(null, usuario)

                }else{

                    return done(null, false, {message: "Senha incorreta!"})

                }


            })


       }).catch((err) => {

            return done(null, false, {message: "Erro interno na aplicação!"})

       })


    }))

    passport.serializeUser((usuario, done) => {

        done(null, usuario.id)

    })

    passport.deserializeUser((id, done) =>  {

        user.findById(id, (err, usuario) => {

            done(err, usuario)

        })

    })


}
