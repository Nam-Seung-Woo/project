const express = require('express');
const logger = require('morgan');
const favicon = require('serve-favicon');
const path = require('path');
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');

var app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(logger('dev')); // 로깅처리
app.use(express.static(__dirname + '/public'));
app.use(serveStatic(path.join(__dirname, 'public'))); // 정적 파일 처리
app.use(express.urlencoded({extended: true})); // body data 파싱
app.use(favicon(path.join(__dirname, 'public/images','favicon.ico'))); // 파비콘 세팅
app.use(cookieParser());
app.use(require('./models/session'));

app.set('view engine', 'ejs');  //템플릿 엔진 세팅
app.set('views', './views');    //ejs 파일이 저장된 디렉토리

var main = require('./routes/main');
app.use('/', main);

var count=1;
io.on('connection', function(socket){ //3
    console.log('user connected: ', socket.id);  //3-1
    // var name = "user" + count++;                 //3-1
    // io.to(socket.id).emit('change name',name);   //3-1

    socket.on('disconnect', function(){ //3-2
        console.log('user disconnected: ', socket.id);
    });

    socket.on('send message', function(name,text){ //3-3
        var msg = name + ' : ' + text;
        console.log(msg);
        io.emit('receive message', msg);
    });
});

var user = require('./routes/user');
app.use('/user', user);

var chat = require('./routes/chat');
app.use('/chat', chat);

http.listen(8080, function(){
    console.log('8080포트에서 대기중');
})