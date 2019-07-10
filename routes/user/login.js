const express = require('express');
const crypto = require('crypto');

var pool = require('../../models/pool');

module.exports.get = function(req, res) {
    res.render('user/login', {
        title: 'GGutu-login', 
        message: 0
    });
}

module.exports.post = function(req, res) {
    if(req.body.id && req.body.pw){
        pool.getConnection(function(err, con){
            if(err) {
                console.log(err.message);
                return;
            }

            pool.query("SELECT * from clients where id = '" + req.body.id + "'", function(err, rows) {
                if(err) console.log(err.message);
                else {
                    console.log(rows.length);
                    if(rows.length === 0){
                        // 등록 아이디 x
                        res.render('user/login', {title: 'GGutu-login', message: 1});
                    } else {    
                        var encrypted_pw = crypto.createHash("sha512").update(req.body.pw + rows[0].salt).digest('hex');

                        if(rows[0].pw !== encrypted_pw){
                            // 비밀번호 틀렸을 때
                            res.render('user/login', {title: 'GGutu-login', message: 2});
                        } else {
                            // 로그인 성공
                            req.session.name = rows[0].name;
                            req.session.score = rows[0].score;
                            res.redirect('/');
                        }
                    }
                    con.release();
                }
            });
        });

    } else {
        res.render('user/login', {title: 'GGutu-login', message: 3});
    }
}