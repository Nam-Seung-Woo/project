const crypto = require('crypto');

var pool = require('../../models/pool');

module.exports.get = function(req, res){
    res.render('user/signup', {title: 'GGutu-signup', message: ''});
}

module.exports.post = function(req, res){
    if(req.body.id && req.body.pw && req.body.pwcheck && req.body.name){
        pool.getConnection(function(err, con){
            if(err) {
                console.log(err.message);
                return;
            }
    
            // '' 비로그인 상태 0 회원가입 성공 1 아이디 중복 2 닉네임 중복 3 비밀번호 확인 실패
            // 4 아이디 문제 5 비밀번호 문제 6 닉네임 길이 7 전부 입력 하지 않음
            
            pool.query("SELECT * from clients where id = '" + req.body.id + "'", function(err, rows) {
                var message = '0'; 
                if(err) console.log(err.message);
                else {
                    if(rows.length == 1){
                        // 이미 등록된 아이디
                        console.log('아이디 중복');
                        con.release();
                        res.render('user/signup', {title: 'GGutu-signup', message: '1'});
                        return;
                    }

                    pool.query("SELECT * from clients where name = '" + req.body.name + "'", function(err, rows) {
                        if(err) console.log(err.message);
                        else {
                            if(rows.length == 1){
                                // 이미 등록된 닉네임
                                console.log('닉네임 중복');
                                message = '2';
                            } else if(req.body.pw != req.body.pwcheck) {message = '3'; console.log('pw 확인 실패');}
                            else if(req.body.id.length > 20) {message = '4'; console.log('아이디 문제');}
                            else if(req.body.pw.length > 25) {message = '5'; console.log('pw 문제');}
                            else if(req.body.name.length > 10) {message = '6'; console.log('닉네임 길이');}
                            else {
                                var pattern_num = /[0-9]/;	// 숫자 
                                var pattern_eng = /[a-zA-Z]/;	// 문자
                                var pattern_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자
                                var pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크
                                if(!(pattern_num.test(req.body.id)) && !(pattern_eng.test(req.body.id)) && pattern_spc.test(req.body.id) && pattern_kor.test(req.body.id)) {message = '4'; console.log('아이디 문제');}
                                else if(!(pattern_num.test(req.body.pw)) && !(pattern_eng.test(req.body.pw)) && pattern_spc.test(req.body.pw) && pattern_kor.test(req.body.pw)) {message = '5'; console.log('pw 문제');}
                            }

                            console.log(message);
                            if(message === '0'){
                                var salt = Math.round((new Date().valueOf() * Math.random())) + "";
                                var encrypted_pw = crypto.createHash("sha512").update(req.body.pw + salt).digest('hex');
                                var moment = require('moment');
                                require('moment-timezone');
                                moment.tz.setDefault("Asia/Seoul");
                                var now = moment().format('YYYY-MM-DD');
                                console.log(now);

                                pool.query("insert into clients values('" + req.body.id + "', '" + encrypted_pw + "', '" + req.body.name + "', 0, '" + now + "', '" + now + "', '" + salt +"', 0, 0)", function(err, result){
                                    if(err) console.log(err.message);
                                });
                            }

                            con.release();
                            res.render('user/signup', {title: 'GGutu-signup', message: message});
                        }
                    });
                }
            });
         });

    } else {
        res.render('user/signup', {title: 'GGutu-signup', message: '7'});
    }
}