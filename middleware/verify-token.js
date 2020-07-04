const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=> {
    const token = req.headers["x-access-token"] || req.body.token || req.query.token     // 3 şekilde gelebilir header-body-query
    if (token){
        jwt.verify(token,req.app.get("api_secret_key"),(err,decoded)=>{
            if(err){
                res.json({status:false,message:"Hatalı token"})
            }else {
                req.decode = decoded;
                console.log(decoded);
                next();
            }
        })
    }else{
        res.json({status:false,message:"Token sağlanamadı tekrar giriş yapınız..."})
    }
}

//query     localhost:3000/api/movies?token=hbjkrvhhvıgqerhıvh       query i bu şekilde alabiliriz




