const mongoose = require('./connection')

const CategorySchema = mongoose.Schema({

    name: {

        type: String,
        required: true

    },
    slug: {

        type: String,
        required: true

    },
    date:{

        type: Date,
        default: Date.now()

    }

})

category = mongoose.model('categories', CategorySchema)

module.exports = category