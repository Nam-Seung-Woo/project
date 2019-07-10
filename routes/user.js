const express = require('express');
const router = express.Router();



router.route('/').get(function(req, res){
    if(req.cookies){
        res.send('로그인 성공');
    } else {
        res.redirect('/user/login');
    }
});

var login = require('./user/login');
router.route('/login')
    .get(login.get)
    .post(login.post);

var logout = require('./user/logout');
router.route('/logout')
    .get(logout.get);

var signup = require('./user/signup');
router.route('/signup')
    .get(signup.get)
    .post(signup.post);

var information = require('./user/information');
router.route('/information')
    .get(information.get)
    .post(information.post);






module.exports = router;