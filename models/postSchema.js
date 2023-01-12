const mongoose = require("../database/connection")

const postSchema = mongoose.Schema({

    titulo:{

        type: String,
        required: true

    },
    slug:{

        type: String,
        required: true

    },
    descricao:{

        type: String,
        required: true

    },
    conteudo:{

        type: String,
        required: true

    },
    categoria:{

        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true

    },
    data:{

        type: Date,
        default: Date.now()

    }

})


post = mongoose.model("posts", postSchema)

module.exports = post