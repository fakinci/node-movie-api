const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    username:{
        type:String,
        required:[true,"username alanı gereklidir!"],
        maxlength:[10,"username alanı 10 karakterden az olmalıdır!"],
        minlength:[3,"username alanı enaz 3 karakter olmalıdır!"],
        unique:true
    },
    password: {
        type:String,
        required:[true,"password alanı gereklidir!"],
        minlength:[5,"password alanı enaz 5 karakter olmalıdır!"]
    },

    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("user",UserSchema);