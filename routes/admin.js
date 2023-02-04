//MODULOS
const express = require('express')
const app = express()
const router = express.Router()
//const bodyParser = require('body-parser')
const category = require('../models/categorySchema')
const post = require('../models/postSchema')

//ROUTES ADM

router.get('/', (req, res) => {

    res.render('admin/index')

})

router.get('/posts', (req, res) => {

    res.send('Página de Post')

})

router.get('/categorias', (req, res) => {

    category.find().sort({ date: "desc" }).then((categories) => {

        res.render('admin/categorias', { categories: categories })

    }).catch((err) => {

        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")

    })


})

router.get('/categorias/add', (req, res) => {

    res.render('admin/addcategorias')

})

router.post('/categorias/nova', (req, res) => {

    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {

        erros.push({
            texto: "Nome da categoria é inválido"
        })

    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {

        erros.push({
            texto: "O slug é inválido"
        })

    }

    if (req.body.nome.length < 2) {

        erros.push({
            texto: "Nome da categoria muito pequeno"
        })

    }


    if (erros.length > 0) {

        res.render("admin/addcategorias", { erros: erros })

    } else {

        const NewCategory = {

            name: req.body.nome,
            slug: req.body.slug

        }

        new category(NewCategory).save().then(() => {

            req.flash("success_msg", "Categoria cadastrada com sucesso!")
            res.redirect("/admin/categorias")

        }).catch((err) => {

            req.flash("error_msg", "Erro ao cadastrar a categoria, por favor tente novamente!")
            console.log("Erro ao criar categoria: " + err)

        })

    }


})

router.get("/categorias/edit/:id", (req, res) => {

    category.findOne({ _id: req.params.id }).then((categoria) => {

        res.render("admin/editcategorias", { categoria: categoria })

    }).catch((err) => {

        req.flash("error_msg", "Ocorreu um erro ao tentar editar esta categoria")
        res.redirect("/admin/categorias")

    })

})

router.post("/categorias/edit", (req, res) => {

    category.findOne({ _id: req.body.id }).then((categoria) => {


        var erros = []

        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {

            erros.push({
                texto: "Nome da categoria é inválido"
            })

        }

        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {

            erros.push({
                texto: "O slug é inválido"
            })

        }

        if (req.body.nome.length < 2) {

            erros.push({
                texto: "Nome da categoria muito pequeno"
            })

        }


        if (erros.length > 0) {

            res.render("admin/editcategorias", { erros: erros, categoria: categoria })

        } else {

            categoria.name = req.body.nome,
                categoria.slug = req.body.slug

            categoria.save().then(() => {

                req.flash("success_msg", "Categoria Editada com sucesso!")
                res.redirect("/admin/categorias")

            }).catch((err) => {

                req.flash("error_msg", "Houve um erro ao tentar editar essa categoria")
                res.redirect("/admin/categorias")

            })
        }


    }).catch((err) => {

        req.flash("error_msg", "Houve um erro ao tentar editar essa categoria")
        res.redirect("/admin/categorias")

    })

})


router.post("/categorias/deletar", (req, res) => {

    category.deleteOne({ _id: req.body.id }).then(() => {

        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")

    }).catch((err) => {

        req.flash("error_msg", "Houve um erro ao deletar a categoria!")
        res.redirect("/admin/categorias")

    })



})

router.get("/postagens", (req, res) => {

    post.find().populate({path: 'categoria', strictPopulate: false}).sort({data: "desc"}).then((postagens) => {

        res.render("admin/postagens", {postagens: postagens})

    }).catch((err) => { 

        req.flash("error_msg", "Houve um erro ao buscar as postagens cadastradas!")
        res.redirect("/admin")

    })

    

})

router.get("/postagens/add", (req, res) => {

    category.find().then((categorias) => {

        res.render("admin/addpostagem", {categorias: categorias})

    }).catch((err) => {

        req.flash("error_msg", "Houve um erro ao buscar as categorias cadastradas!")
        res.redirect("/admin/postagens")

    })

})

router.post("/postagens/nova", (req, res) => {

    if(req.body.categoria == "1"){
        req.flash("error_msg", "Para realizar uma postagem você deve selecionar uma categoria!")
        res.redirect("/admin/postagens/add")
    }else if(req.body.categoria == "0"){
        req.flash("error_msg", "Categoria Inválida, registre uma categoria para realizar uma postagem!")
        res.redirect("/admin/postagens/add")
    }else{

        const postagem = {

            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria

        }

        new post(postagem).save().then(() => {

            req.flash("success_msg", "Postagem cadastrada com sucesso!")
            res.redirect("/admin/postagens")

        }).catch((err) => {

            req.flash("error_msg", "Houve um erro ao tentar cadastrar essa postagem!")
            res.redirect("/admin/postagens")

        })



    }

})

router.get("/postagens/edit/:id", (req, res) => {

    post.findOne({_id: req.params.id}).populate({path: 'categoria', strictPopulate: false}).then((postagem) => {

        category.find().then((categorias) => {

            res.render("admin/editpostagens", {postagem: postagem, categorias: categorias})    

        }).catch((err) => {

            req.flash("error_msg", "Ocorreu um erro ao buscar as categorias!")
            res.redirect("/admin/postagens")
    
        })


    }).catch((err) => {

        req.flash("error_msg", "Ocorreu um erro ao buscar por esta postagem!")
        res.redirect("/admin/postagens")

    })


})

router.post("/postagens/edit", (req, res) => {

    if(req.body.categoria == "1"){
        req.flash("error_msg", "Para realizar uma postagem você deve selecionar uma categoria!")
        res.redirect("/admin/postagens/add")
    }else if(req.body.categoria == "0"){
        req.flash("error_msg", "Categoria Inválida, registre uma categoria para realizar uma postagem!")
        res.redirect("/admin/postagens/add")
    }else{

        post.findOne({_id: req.body.id}).then((postagem) => {

            postagem.titulo = req.body.titulo
            postagem.titulo = req.body.titulo,
            postagem.slug = req.body.slug,
            postagem.descricao = req.body.descricao,
            postagem.conteudo = req.body.conteudo,
            postagem.categoria = req.body.categoria

            
            postagem.save().then(() => {

                req.flash("success_msg", "Postagem atualizada com sucesso!")
                res.redirect("/admin/postagens")

            }).catch((err) => {

                req.flash("error_msg", "Ocorreu um erro ao tentar editar a postagem!")
                res.redirect("/admin/postagens")
    
            })

        }).catch((err) => {

            req.flash("error_msg", "Ocorreu um erro ao tentar editar a postagem!")
            res.redirect("/admin/postagens")

        })

    }

})

router.post("/postagens/deletar", (req, res)=> { 

    post.deleteOne({_id: req.body.id}).then(()=>{

        req.flash("success_msg", "Postagem deletada com sucesso!")
        res.redirect("/admin/postagens")

    }).catch((err) => {

        req.flash("error_msg", "Ocorreu um erro ao tentar delatar a postagem!")
        res.redirect("/admin/postagens")

    })



})


//EXPORT
module.exports = router