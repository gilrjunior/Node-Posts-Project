const mongoose = require('../database/connection')

const userSchema = mongoose.Schema({

    name: {

        type: String,
        required: true

    },
    password: {

        type: String,
        required: true

    },
    Admin: {

        type: Number,
        default: 0

    },
    email: {

        type: String,
        required: true

    }

})

const user = mongoose.model("users", userSchema)

module.exports = user

