import express from 'express';
import bodyParser from 'body-parser'; 

const app=express();
const PORT=5000;

app.use(bodyParser.json());

app.get('/healthz',(req,res)=>{
    console.log('[test]');

    res.send('http.StatusOk');

});

app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT: http://localhost:${PORT}`) );