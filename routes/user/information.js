const crypto = require('crypto');

var pool = require('../../models/pool');

module.exports.get = function(req, res){
    if(req.session.name){
        pool.getConnection(function(err, con){
            if(err) {
                console.log(err.message);
                return;
            }
            
            pool.query(`SELECT * from clients where name = '${req.session.name}'`, function(err, rows) {
                if(err) {
                    console.log(err.message);
                    return;
                }
                console.log(rows[0].createat);
                res.render('user/information', {title: 'GGutu-information', message: 0,information: {
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
    } else {
        res.redirect("/");
    }
}

module.exports.post = function(req, res){
    pool.getConnection(function(err, con){
        if(err){
            console.log(err.message);
            con.release();
            return;
        }
        

        pool.query(`select * from clients where name = '${req.session.name}'`, function(err, rows){
            if(err){
                console.log(err.message);
                con.release();
                return;
            }
            var message = 0;

            if(req.body.pw && req.body.pwcheck){
                if(req.body.pw === req.body.pwcheck){
                    var salt = Math.round((new Date().valueOf() * Math.random())) + "";
                    var encrypted_pw = crypto.createHash("sha512").update(req.body.pw + salt).digest('hex');
                    var moment = require('moment');
                    require('moment-timezone');
                    moment.tz.setDefault("Asia/Seoul");
                    var now = moment().format('YYYY-MM-DD');
                    message = 3;
                    pool.query(`update clients set pw = '${encrypted_pw}', salt = '${salt}', updateat = '${now}' where name = '${req.session.name}'`, function(err, result){
                        if(err){
                            console.log(err.message);
                            con.release();
                            return;
                        }
                    });
                    
                } else {
                    message = 2;
                }
            } else {
                message = 1;
            }

            // 1 입력 안함 2 같지 않음 3 변경 완료
            res.render('user/information', {title: 'GGutu-information', message: message,information: {
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
    })
}