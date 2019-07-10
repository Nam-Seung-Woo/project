const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
    res.render('chat', {title: 'chatting test'})
});


module.exports = router;