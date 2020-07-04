const express = require('express');
const router = express.Router();

const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('index', { title: 'Hi, Express' });
});

//kullanıcı ekleme
router.post('/register', (req, res, next)=> {
  /*  const user = new User(req.body);  // bcryptjs kullanmasaydık kısaca böyle yapılabilirdi
  const promise = user.save()
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });*/

  const { username, password } = req.body;           // destructing yapısıyla böyle de kullanabilizriz

  bcrypt.hash(password, 10).then((hash)=> {
    const user = new User({
      username,                                      //buranın açılımı const user = new User({username:username,password:password}); yani burada kullanılan username eşittir model klasörü içindeki User.js deki username dir.
      password:hash
    });
    const promise = user.save();
    promise.then((data)=>{
      res.json(data);
    }).catch((err)=>{
      res.json(err);
    });
  });
});

//kimlik doğrulaması
router.post("/authenticate",(req,res)=>{
  const {username,password} = req.body;
  User.findOne({username},(err,user)=>{
    if(err)
      throw err;
    if(!user){
      res.json({status:false,message:"Kullanıcı bulunamadı!"});
    }else{
      bcrypt.compare(password,user.password).then((result)=>{
        if(!result){
          res.json({status:false,message:"Yanlış şifre girdiniz!"});
        }else{
          const payload = {username};
          const token = jwt.sign(payload, req.app.get("api_secret_key"),{expiresIn: 20});
          res.json({status:true,token});
        }
      })
    }
  })
});

module.exports = router;
