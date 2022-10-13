import express from 'express';
import bodyParser from 'body-parser'; 

import usersRoutes from './routes/users.js';
//import db from './db.js';

const app=express();

app.use('/', usersRoutes); 

app.get('/healthz',(req,res)=>{
    res.status(200).send()
});

var server= app.listen(8000,function(){
    console.log("server is listening at port 8000")
})

export default app;
