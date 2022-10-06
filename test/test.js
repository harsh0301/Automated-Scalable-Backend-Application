import server from'../index.js';
import * as chai from "chai";
import should from 'should';
import supertest from 'supertest';

var check = supertest.agent("http://localhost:5000");

describe("SAMPLE unit test",function(){

    // #1 should return home page
  
    it("Checking healthz api",function(done){
  
      // calling home page api
      check
      .get("/healthz")
      .expect(200) // THis is HTTP response
      .end(function(err,res){
        // HTTP status should be 200
        res.status.should.equal(200);
        // Error key should be false.
        res.body.error.should.equal(false);
        done();
      });
    });
  
  });