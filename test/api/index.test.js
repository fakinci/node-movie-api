const chai = require("chai");               //"test": "./node_modules/.bin/mocha --exit --recursive"   package.json da scripts  bölümüne bunu ekle (test klasörü altındaki tüm dosyaları görmesi için)
const chaiHttp = require("chai-http");
const should = chai.should();

const server = require("../../app");

chai.use(chaiHttp);

describe("Node Server", ()=>{
    it("(GET /) Anasayfayı döndürür.", (done)=>{
        chai.request(server)
            .get("/")
            .end((err,res)=>{
                res.should.have.status(200);
                done();
            })
    })
});