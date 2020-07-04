const mongoose = require("mongoose");
//db mlab bağlama
module.exports= ()=>{
    mongoose.connect("mongodb://movie_user:abcd1234@ds161780.mlab.com:61780/heroku_frwqbszm",{useNewUrlParser: true, useUnifiedTopology: true})
    mongoose.connection.on("open",()=>{
        console.log("mongodb bağlı");
    })
    mongoose.connection.on("error",(err)=>{
        console.log("mongodb bağlantı hatası",err);
    });

    mongoose.Promise = global.Promise; // mongoose ın önerisi
};
