const express = require('express')
const cors = require('cors')


const app = express()

// middleware

app.use(express.json())

app.use(express.urlencoded({ extended: true }))


// routers
const router = require('./routes/productRouter.js')
app.use('/v1/account', router)


app.get('/healthz',(req,res)=>{
    res.status(200)
});


//port

const PORT = process.env.PORT || 8080

//server

var server=app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

module.exports = server;