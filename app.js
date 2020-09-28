const express = require('express');
const mysql = require('mysql');
var cons = require('consolidate');
const path = require('path');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');
dotenv.config({path:'./.env'});

const app = express();

app.options("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization ");
    res.sendStatus(200);
  });
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization ");
    next();
  });


app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
})

const publicdirectory = path.join(__dirname,'./public');
app.use(express.static(publicdirectory));


app.engine('html', cons.swig)
app.set("views","views");
app.set('view engine', 'html');


db.connect((error)=>{
    if (error) {
        console.log(error)
    }else {
        console.log("MYSQL CONNECTED...")
    }
})

app.use('/', require('./routes/pages'));
app.use('/auth',require('./routes/auth'));

app.listen(5050,(req,res)=>{
    console.log("running on a port 5050");
})