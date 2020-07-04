const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

const server = require("../../app");

chai.use(chaiHttp);

let token,movieId;  // movieId yi  movie id ile film ararken kullanacağız

describe("/api/movies tests", ()=>{
   before((done)=>{
       chai.request(server)
           .post("/authenticate")
           .send({username:"test",password:"12345"})
           .end((err,res)=>{
               token=res.body.token;
               done();
           })
   })

    describe("/GET movies",()=>{
        it("Tüm filmleri getirmeli",(done)=>{
            chai.request(server)
                .get("/api/movies")
                .set("x-access-token",token)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    done();
                })

        })
    })

    describe("/POST movies",()=>{
        it("Film eklenmeli",(done)=>{
            const movie = {
                title:"test movie",
                director_id:"5ef75c2f4230a72aace5aed7",
                category:"komedi",
                country:"Türkiye",
                year:2005,
                imdb_score:8.5
            };
            chai.request(server)
                .post("/api/movies")
                .send(movie)
                .set("x-access-token",token)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("title");
                    res.body.should.have.property("director_id");
                    res.body.should.have.property("category");
                    res.body.should.have.property("country");
                    res.body.should.have.property("year");
                    res.body.should.have.property("imdb_score");
                    movieId=res.body._id  // movieId yi  movie id ile film ararken kullanacağız
                    done();
                })
        })
    })


    describe("/GET/:movie_id ",()=>{
        it("Girilen film id'si ile filmi gösterme ",(done)=>{
            chai.request(server)
                .get("/api/movies/" + movieId)
                .set("x-access-token",token)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("title");
                    res.body.should.have.property("director_id");
                    res.body.should.have.property("category");
                    res.body.should.have.property("country");
                    res.body.should.have.property("year");
                    res.body.should.have.property("imdb_score");
                    res.body.should.have.property("_id").eql(movieId);
                    done();
                })
        })
    })

    describe('/PUT/:movie_id ', () => {
        it("Girilen film id'si ile filmi güncelleme", (done) => {
            const movie = {
                title: 'test movie update',
                director_id: '5ef75c2f4230a72aace5aed7',
                category: 'Suç',
                country: 'Fransa',
                year: 1970,
                imdb_score: 9
            };

            chai.request(server)
                .put('/api/movies/' + movieId)
                .send(movie)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title').eql(movie.title);
                    res.body.should.have.property('director_id').eql(movie.director_id);
                    res.body.should.have.property('category').eql(movie.category);
                    res.body.should.have.property('country').eql(movie.country);
                    res.body.should.have.property('year').eql(movie.year);
                    res.body.should.have.property('imdb_score').eql(movie.imdb_score);
                    done();
                });
        });
    });

    describe('/DELETE/:movie_id movie', () => {
        it("Girilen film id'si ile filmi silme", (done) => {
            chai.request(server)
                .delete('/api/movies/' + movieId)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(1);
                    done();
                });
        });
    });



});
