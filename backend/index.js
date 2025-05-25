const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const {clerkMiddleware} = require("@clerk/express");
const usersRouter = require('./routes/userRouter')

require('dotenv').config()

app.use(clerkMiddleware());

app.use(`/api/v1/users`, usersRouter)

const start = async () => {
    try{
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}...`)
        })
    }catch(error){
        console.error(error)
        process.exit(1)
    }
}

start()