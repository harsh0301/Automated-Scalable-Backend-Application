import express from 'express';
import bodyParser from 'body-parser'; 

import usersRoutes from './routes/users.js';
import db from './db.js';

const app=express();
const PORT=5000;

app.use(bodyParser.json());

app.use('/', usersRoutes); 

app.get('/healthz',(req,res)=>{
    res.json({"error" : false, "message" : "Hello !"});
});

app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT: http://localhost:${PORT}`) );

export default app;
