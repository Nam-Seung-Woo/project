const crypto = require('crypto');

var pool = require('../../models/pool');

module.exports.get = function(req, res){
    pool.getConnection(function(err, con){
        if(err) {
            console.log(err.message);
            return;
        }
        
        pool.query("SELECT * from clients where name = '" + req.session.name + "'", function(err, rows) {
            if(err) {
                console.log(err.message);
                return;
            }
            console.log(rows[0].createat);
            res.render('user/information', {title: 'GGutu-information', information: {
                id: rows[0].id,
                name: rows[0].name,
                score: rows[0].score,
                win: rows[0].win,
                lose: rows[0].lose,
                createat: rows[0].createat,
                updateat: rows[0].updateat
            }});

            con.release();
        });
    });
}

module.exports.post = function(req, res){
    if(req.body.pw && req.body.pwcheck){
        if(req.body.pw === req.body.pwcheck){
            pool.getConnection(function(err, con){
                var salt = Math.round((new Date().valueOf() * Math.random())) + "";
                var encrypted_pw = crypto.createHash("sha512").update(req.body.pw + salt).digest('hex');
                var moment = require('moment');
                require('moment-timezone');
                moment.tz.setDefault("Asia/Seoul");
                var now = moment().format('YYYY-MM-DD');

                pool.query("update clients set pw = '" + encrypted_pw + "', salt = '" + salt + "', updateat = '" + now + "' where name = '" + req.session.name + "'", function(err, result){
                    if(err){
                        console.log(err.message);
                        return;
                    }

                    res.redirect('/user/information');
                    con.release();
                });
            })
        } else {
            res.send('같게 입력해주세요');
        }
    } else {
        res.send('다 써줘');
    }
}