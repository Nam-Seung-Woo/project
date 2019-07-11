const express = require('express');

module.exports.get = function(req, res) {
    if(req.session.name){
        console.log('세션 삭제');
        req.session.destroy();
        res.clearCookie('sid');
    }
    res.redirect("/")
}