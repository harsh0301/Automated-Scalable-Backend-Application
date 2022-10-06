import server from'../index.js';
import * as chai from "chai";
import should from 'should';
import supertest from 'supertest';

var check = supertest.agent("http://localhost:5000");

describe("SAMPLE unit test",function(){

    // #1 should return home page
  
    it("Checking healthz api",function(done){
      
      console.log("Hello world")
      done();
      
    });
  
  });