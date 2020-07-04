const mongoose=require("mongoose");
const express = require('express');
const router = express.Router();

const Director = require("../models/Director");

// director ekleme
router.post('/', (req, res, next) => {

    const director = new Director(req.body);

    const promise = director.save();

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});



// ilişkisel listeleme
router.get("/", (req, res) => {
    const promise = Director.aggregate([
        {
            $lookup: {
                from: "movies",
                localField: "_id",
                foreignField: "director_id",
                as: "movies"
            }
        },
      {
        $unwind: {
          path:"$movies",
          preserveNullAndEmptyArrays:true  // filmi olmayan yönetmenleri de getiriyor
        }
      },
      {
        $group:{     // karışık grupluyor
          _id:{
            _id:"$_id",
            name:"$name",
            surname:"$surname",
            bio:"$bio"
          },
          movies:{
            $push:"$movies"
          }

        }
      },
      {
        $project:{             // görsel olarak düzenliyor
          _id:"$_id._id",
          name:"$_id.name",
          surname:"$_id.surname",
          bio:"$_id.bio",
          movies:"$movies"
        }
      }
    ]);
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(data);
  });
});

router.get("/:director_id", (req, res) => {
  const promise = Director.aggregate([
    {
      $match:{            // eşleşme yapıyorsan match kullanılıyor
        _id:mongoose.Types.ObjectId(req.params.director_id)  //mongoose.Types.ObjectId bunu kullanıyorsan yukarıda mongoose ı sayfaya dahil etmelisin
      }
    },



    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "director_id",
        as: "movies"
      }
    },
    {
      $unwind: {
        path:"$movies",
        preserveNullAndEmptyArrays:true  // filmi olmayan yönetmenleri de getiriyor
      }
    },
    {
      $group:{     // karışık grupluyor
        _id:{
          _id:"$_id",
          name:"$name",
          surname:"$surname",
          bio:"$bio"
        },
        movies:{
          $push:"$movies"
        }

      }
    },
    {
      $project:{            //  görsel olarak düzenliyor
        _id:"$_id._id",
        name:"$_id.name",
        surname:"$_id.surname",
        bio:"$_id.bio",
        movies:"$movies"
      }
    }
  ]);
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(data);
  });
});

//güncelleme
router.put("/:director_id",(req,res,next)=>{  //:director_id bu iki noktanın anlamı dinamiklik katıyor yani istemciden girilen değere göre işlem yapar.

  const promise = Director.findByIdAndUpdate(req.params.director_id, req.body,{new:true}); //1. parametre request te gönderilen parametreyi yani id  yi alıyoruz 2. paranmetre istemcide girilen veri  body.  {new:true}  bu parametre ise istemcide güncellemeden sonra güncellenen yeni datayı gösterir bunu yapmazsak eski datayı gösterir ama db de günceller tabi

  if(req.params.director_id.length!==24)
    next({message: "Girilen id 24 karakter olmalı!", code: 80});

  promise.then((data)=>{
    if(!data)
      next({message: "Film bulunamadı!", code: 99});
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});



//silme
router.delete("/:director_id",(req,res,next)=>{

  const promise = Director.findByIdAndDelete(req.params.director_id);

  if(req.params.director_id.length!==24)
    next({message: "Girilen id 24 karakter olmalı!", code: 80});

  promise.then((data)=>{
    if(!data)
      next({message: "Film bulunamadı!", code: 99});
    res.json({status:1}); //  status:1  silme işlemi başarılı
  }).catch((err)=>{
    res.json(err);
  });
});

module.exports = router;
