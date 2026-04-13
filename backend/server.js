const express = require("express")

const app = require("./src/app")
require('dotenv').config()
const port = process.env.PORT;

console.log(port)



app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`)
})