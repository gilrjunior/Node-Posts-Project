//MODULOS
    const express = require('express')
    const app = express()
    const router = express.Router()
    //const bodyParser = require('body-parser')
    const category = require('../database/categorySchema')

//ROUTES ADM

    router.get('/', (req, res) => {

        res.render('admin/index')

    })

    router.get('/posts', (req, res) => {

        res.send('Página de Post')
        
    })

    router.get('/categorias', (req, res) => {

        category.find().sort({date: "desc"}).then((categories) => {

            res.render('admin/categorias', {categories: categories})

        }).catch((err) => {

            req.flash("error_msg", "Houve um erro ao listar as categorias")
            res.redirect("/admin")

        })
        

    })

    router.post('/categorias/nova', (req,res) => {

        var erros = []

        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){

            erros.push({
                texto: "Nome da categoria é inválido"
            })

        }

        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){

            erros.push({
                texto: "O slug é inválido"
            })

        }

        if(req.body.nome.length < 2){

            erros.push({
                texto: "Nome da categoria muito pequeno"
            })

        }


        if(erros.length > 0){

            res.render("admin/addcategorias", {erros: erros})

        }else{

            const NewCategory = {

                name: req.body.nome,
                slug: req.body.slug
    
            }
    
            new category(NewCategory).save().then(() => {
                
                req.flash("success_msg", "Categoria cadastrada com sucesso!")
                res.redirect("/admin/categorias")
    
            }).catch((err) => {

                req.flash("error_msg", "Erro ao cadastrar a categoria, por favor tente novamente!")
                console.log("Erro ao criar categoria: "+err)
    
            })
    
        }


    })

    router.get("/categorias/edit/:id", (req, res) => {

        category.findOne({_id: req.params.id}).then((categoria) => {

            res.render("admin/editcategorias", {categoria: categoria})

        }).catch((err) => {

            req.flash("error_msg", "Ocorreu um erro ao tentar editar esta categoria")
            res.redirect("/admin/categorias")

        })

    })

    router.post("/categorias/edit", (req, res) => {

        category.findOne({_id: req.body.id}).then((categoria) => {

            
            var erros = []

            if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){

                erros.push({
                    texto: "Nome da categoria é inválido"
                })

            }

            if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){

                erros.push({
                    texto: "O slug é inválido"
                })

            }

            if(req.body.nome.length < 2){

                erros.push({
                    texto: "Nome da categoria muito pequeno"
                })

            }


            if(erros.length > 0){

                res.render("admin/editcategorias", {erros: erros, categoria: categoria})

            }else{            

                categoria.name = req.body.nome,
                categoria.slug = req.body.slug

                categoria.save().then(()=>{

                    req.flash("success_msg", "Categoria Editada com sucesso!")
                    res.redirect("/admin/categorias")

                }).catch((err) =>{

                    req.flash("error_msg", "Houve um erro ao tentar editar essa categoria")
                    res.redirect("/admin/categorias")

                })
            }


        }).catch((err) => {

            req.flash("error_msg", "Houve um erro ao tentar editar essa categoria")
            res.redirect("/admin/categorias")

        })

    })

    router.get('/categorias/add', (req, res) => {

        res.render('admin/addcategorias')

    })


//EXPORT
    module.exports = router