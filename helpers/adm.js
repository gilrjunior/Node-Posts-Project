module.exports = {

    Adm: function(req, res, next){

        if(req.isAuthenticated() && req.user.Admin == 1){

            return next()            

        }

        req.flash("error_msg", "Para acessar este caminho você deve ser um administrador!")
        res.redirect("/")

    }


}