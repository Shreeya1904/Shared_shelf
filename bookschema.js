const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/SharedShelf")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log("fail.connect");
    })
const bookschema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    outlook: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        reuired: true,
    },
    sold: {
        type: Boolean,
        default: false,
    },
    genre: {
        type: [String],
        required: true,
    },
    bookimage: {
        type: String,
        required: true,
    },
    password: { 
        type: String,
        required: true,
    }
})

const bookdropschema = new mongoose.model("Bookschema", bookschema)
module.exports = bookdropschema;