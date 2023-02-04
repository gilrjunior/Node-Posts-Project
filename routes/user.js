//MODULOS
const express = require('express')
const app = express()
const router = express.Router()
//const bodyParser = require('body-parser')
const category = require('../models/categorySchema')
const post = require('../models/postSchema')

router.get("/", (req, res) => {

    post.find().populate({path: 'categoria', strictPopulate: false}).sort({data: "desc"}).then((postagens) => {

        res.render("index", {postagens: postagens})

    }).catch((err) => {

        req.flash("error_msg", "Houve um erro interno!")
        res.redirect("/404")

    })

})

router.get("/postagens/:id", (req, res) => {

    post.findOne({_id: req.params.id}).populate({path: 'categoria', strictPopulate: false}).then((postagem) => {

        if(postagem){
            res.render("posts/index", {postagem: postagem})
        }else{
            req.flash("error_msg", "A postagem selecionada não existe!")
        }

   }).catch((err) => {

        req.flash("error_msg", "Houve um erro na aplicação!")

   })

})

router.get("/categorias", (req, res) =>{

    category.find().then((categorias) => {

        res.render("categorias/index", {categorias: categorias})

    }).catch((err) => {

        req.flash("error_msg", "Houve um erro interno na aplicação!")
        res.redirect("/")

    })


})

router.get("/categorias/:id/:name", (req, res) => {

    post.find({categoria: req.params.id}).sort({data: "desc"}).then((postagens) => {

        if(postagens){

            res.render("categorias/postagens", {postagens: postagens, name: req.params.name})

        }else{

            req.flash("error_msg", "A categoria informada não existe!")
            res.redirect("/categorias") 

        }


    }).catch((err) => {

        req.flash("error_msg", "Houve um erro interno na aplicação!")
        res.redirect("/")

    })


})



router.get("/404", (req, res) => {

    res.send("ERRO 404!")

})




module.exports =  router