const express = require('express');
const router = express.Router();

//const mysql = require('mysql');
//var pool = require('../models/pool');

router.get('/', function(req, res){
    res.render('main', {title: 'GGutu', session: req.session});
});

module.exports = router;