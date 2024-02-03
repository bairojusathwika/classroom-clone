
const express = require("express");
const path = require("path");
const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Akashma@16221384",
    database: "dbmsclassroom",
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MYSQL CONNECTED")
    }
})

module.exports=db;