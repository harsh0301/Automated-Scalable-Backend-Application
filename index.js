import express from 'express';
import bodyParser from 'body-parser'; 

const app=express();
const PORT=5000;

app.use(bodyParser.json());

app.get('/healthz',(req,res)=>{
    res.send(' ');
});

app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT: http://localhost:${PORT}`) );