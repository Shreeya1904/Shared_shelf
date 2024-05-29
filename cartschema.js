const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/SharedShelf")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log("fail.connect");
    })
const cartschema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    cartoutlook: {
        type: String,
        required: true,
    },
    sold: {
        type: Boolean,
        default: false,
    },
    bookimage: {
        type: String,
        required: true,
    },
})

const cartbookschema = new mongoose.model("Cartschema", cartschema)
module.exports = cartbookschema;