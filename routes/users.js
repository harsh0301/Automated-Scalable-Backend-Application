import express from 'express';
import {v4 as uuidv4} from 'uuid';
import db from '../db.js';
import auth from './basicauth.js'

import bcrypt from 'bcrypt';
import moment from 'moment';
import basicauth from './basicauth.js';
import bodyParser from 'body-parser'; 

 const router = express.Router();

//adding new account
router.post('/vi/account',async(req,res)=>{
    //generating uuid... npm i uuidv4
    const id = uuidv4();

    const first_name= req.body.first_name;
    const last_name= req.body.last_name;

    //generating the bcrypt pass... npm i bcrypt
    const salt=await bcrypt.genSalt()
    const hashPass = await bcrypt.hash(req.body.password,salt)
    const password= hashPass;

    //generating the creation time using moment... npm i moment
    var acc_create = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    var acc_update=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    const username= req.body.username;

    function isEmail(username) {
        var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (email !== '' && email.match(emailFormat)) { return true; }
        
        return false;
    }

    //db.query(`select * from user1 where username=?`,[username],(err,rows)=>{})

    db.query('INSERT into user1 values(?,?,?,?,?,?,?)',[id,first_name,last_name,password,username,acc_create,acc_update],(err,result)=>{
        if(err){
            return res.status(400).send("Email already exists");
        }else{
            res.send("value added")
        }
    })
});


//fetching the account details with ID
// router.get('/vi/account/:id',basicauth, (req,res)=>{
     
//     let sql=`select id,first_name,last_name,username,acc_created from user1 where id = '${req.params.id}'`;
//     let query=db.query(sql, (err,result) => {
//         if(err) throw err; 
//         //throw valid error if not found
//         //return res.status(401).send();
//         res.send(result);
//     });
//  });


 router.get('/vi/account/:id', (req,res)=>{

    var encoded = req.headers.authorization.split(' ')[1];
	// decode it using base64
	var decoded = new Buffer(encoded,'base64').toString();
	var name = decoded.split(':')[0];
	var pass = decoded.split(':')[1];

    db.query(`SELECT * FROM user1 WHERE id = '${req.params.id}'`, async(err,row)=>{
        //console.log(row[0].password)
        if((name == row[0].username) && (await bcrypt.compare(pass,row[0].password))){
            //if (await bcrypt.compare(pass,row[0].password)){
            let sql=`select id,first_name,last_name,username,acc_created,acc_update from user1 where id = '${req.params.id}'`;
            let query=db.query(sql, (err,result) => {
            if(err) throw err; 
            //throw valid error if not found
            //return res.status(401).send();
            res.send(result);
            });
        }
        //}
        else{
            return res.status(401).send("http bad request");
        }
    })
 });

router.put('/vi/account/:id', async(req,res)=>{

    var encoded = req.headers.authorization.split(' ')[1];
	// decode it using base64
	var decoded = new Buffer(encoded,'base64').toString();
	var name = decoded.split(':')[0];
	var pass = decoded.split(':')[1];

    const first_name = req.body.first_name;
    const last_name=req.body.last_name;

    const salt= await bcrypt.genSalt()
    const hashPass = await bcrypt.hash(req.body.password,salt)
    const password= hashPass;

    var acc_update = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    router.use(bodyParser.json()); // imp to take care for conditioning the data coming from json
        //console.log(req.body);

        db.query(`SELECT * FROM user1 WHERE id = '${req.params.id}'`, async(err,row)=>{
        //console.log(row[0].password)
        if((name == row[0].username) && (await bcrypt.compare(pass,row[0].password) && !req.body['username'])){
            let sql=`UPDATE user1 SET first_name=?, last_name=?, password=?, acc_update=? where id ='${req.params.id}'`;
            let data=[first_name,last_name,password,acc_update];
        let query=db.query(sql,data,(err,result) => {
        if(err){
            return res.status(401).send("Hi.... http bad request");
        } 
        res.send(result);
        });
         }else{
        return res.status(401).send("Hellooo... http bad request");
        }   
    });
 });

// router.delete('/:id',(req,res)=>{
//     const { id }=req.params;
    
//     users=users.filter((user)=> user.id !== id);

//     res.send('user deleted')

// });



export default router;