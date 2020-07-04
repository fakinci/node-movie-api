const express = require('express');
const router = express.Router();

//Models

const Movies = require("../models/Movie");

// hepsini bul tüm filmleri getir
router.get("/",(req,res)=>{

  const promise = Movies.aggregate([
    {
      $lookup: {
        from: "directors",
        localField: "director_id",
        foreignField: "_id",
        as: "director"
      }
    },
    {
      $unwind: "$director"
    }
  ]);

  promise.then((data)=>{  //data yerine istediğini yazabilirsin
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

// top 10
router.get("/top10",(req,res)=>{

  const promise = Movies.find({}).limit(10).sort({imdb_score:-1});

  promise.then((data)=>{  //data yerine istediğini yazabilirsin
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});





// id bazlı arama
router.get("/:movie_id",(req,res,next)=>{  //:movie_id bu iki nokta nın anlamı dinamiklik katıyor yani istemciden girilen değere göre işlem yapar.

  const promise = Movies.findById(req.params.movie_id); //request te gönderilen parametreyi yani id  yi alıyoruz

  if(req.params.movie_id.length!==24)
    next({message: "Girilen id 24 karakter olmalı!", code: 80});

  promise.then((data)=>{
    if(!data)
       next({message: "Film bulunamadı!", code: 99});
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

// güncelleme
router.put("/:movie_id",(req,res,next)=>{  //:movie_id bu iki nokta nın anlamı dinamiklik katıyor yani istemciden girilen değere göre işlem yapar.

  const promise = Movies.findByIdAndUpdate(req.params.movie_id, req.body,{new:true}); //1. parametre request te gönderilen parametreyi yani id  yi alıyoruz 2. paranmetre istemcide girilen veri  body.  {new:true}  bu parametre ise istemcide güncellemeden sonra güncellenen yeni datayı gösterir bunu yapmazsak eski datayı gösterir ama db de günceller tabi

  if(req.params.movie_id.length!==24)
    next({message: "Girilen id 24 karakter olmalı!", code: 80});

  promise.then((data)=>{
    if(!data)
      next({message: "Film bulunamadı!", code: 99});
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});


router.delete("/:movie_id",(req,res,next)=>{

  const promise = Movies.findByIdAndDelete(req.params.movie_id);

  if(req.params.movie_id.length!==24)
    next({message: "Girilen id 24 karakter olmalı!", code: 80});

  promise.then((data)=>{
    if(!data)
      next({message: "Film bulunamadı!", code: 99});
    res.json({status:1});
  }).catch((err)=>{
    res.json(err);
  });
});




//film ekleme
router.post('/', (req, res, next)=> {
  //const{title,category,country,year,imdb_score,date} = req.body;   //destructing      // date  e gerek yok aslında çünkü default ayarladık

  const movie = new Movies(req.body);  // istemci tarafında girilen verileri alıyoruz sonra bu verileri db e ekliyeceğiz

  /*movie.save((err,data)=>{  //kayıt ve hata yakalamayı böyle de yapabilirsin ama mongoose aşağıdakini öneriyor
    if(err)
      res.json(err);
    res.json(data);
  });*/

  const promise = movie.save();

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });

});


//between

router.get("/between/:start_year/:end_year",(req,res)=>{  //$gte = büyük eşit  ,  $lte =  küçük eşit

   //const {start_year,end_year}=req.params; buşekilde tanımlanıp aşağıda sadece start_year ve end year olarak ta kullanılabilir.

  const promise = Movies.find({year:{"$gte":parseInt(req.params.start_year), "$lte":parseInt(req.params.end_year)} }); // girilen yıl değeri string olarak giriliyor  bunu parseInt ile number e çeviriyoruz

  promise.then((data)=>{  //data yerine istediğini yazabilirsin
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

module.exports = router;
