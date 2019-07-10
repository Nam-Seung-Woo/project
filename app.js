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

var user = require('./routes/user');
app.use('/user', user);

var chat = require('./routes/chat');
app.use('/chat', chat);

var cnt = 1;
io.on('connection', function(socket){
    console.log('user connected: ', socket.id);
    var name = 'user' + cnt++;
    io.to(socket.id).emit('change name', name);

    socket.on('disconnect', function(){
        console.log('user disconnected: ', socket.id);
    });

    socket.on('send message', function(name, text){
        var msg = name + ' : ' + text;
        console.log(msg);
        io.emit('receive message', msg);
    });
});

http.listen(8080, function(){
    console.log('8080포트에서 대기중');
})