const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DirectorSchema = new Schema({

    name:{
        type:String,
        required:[true,"name alanı gereklidir!"],
        maxlength:[15,"name alanı 15 karakterden az olmalıdır!"],
        minlength:1
    },
    surname: {
        type:String,
        required:[true,"surname alanı gereklidir!"],
        maxlength:[15,"surname alanı 15 karakterden az olmalıdır!"],
        minlength:1
    },
    bio:{
        type:String,
        maxlength:[50,"bio alanı 50 karakterden az olmalıdır!"],
        minlength:1
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("director",DirectorSchema);