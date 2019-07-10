const session = require('express-session');

module.exports = session({
    key: 'sid', // 세션의 키 값
    secret: 'secret', // 암호화된 세션
    resave: false, // 세션을 항상 저장할 것인가?
    saveUninitialized: true, // 세션 저장 전에 uninitialize. ???
    cookie: { // 쿠키 설정
      maxAge: 1000 * 60 * 60 // 쿠키 유효기간 24시간
    }
});