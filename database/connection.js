const mongoose = require('mongoose')

mongoose.set('strictQuery', true)
mongoose.connect('mongodb://127.0.0.1:27017/ProjetoAPP', {

    useNewUrlParser: true

}).then(() => {

    console.log("Conectado ao banco!")

}).catch((err) => {

    console.log("Erro ao conectar" +err)

})

module.exports = mongoose