const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/SharedShelf")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log("fail.connect");
    })
const student = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,        
    },
    lastname: {
        type: String,
        required: false,
    },
    outlook: {
        type: String,
        required: true,
        unique: true,
    },
    contact: {
        type: String,
        required: true,
    },
    hostel: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})

const students = new mongoose.model("Student", student)
module.exports = students