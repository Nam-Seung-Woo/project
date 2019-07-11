
// // DB 테스트
// const express = require('express');
// const mysql = require('mysql');

// //var dbconfig = require('./models/database');
// //var connection = mysql.createConnection(dbconfig);
// var app = express();

// var pool = mysql.createPool({
//     connectionLimit: 10,
//     user: 'root',
//     password: 'nsw0311',
//     database: 'test'
// });

// app.get('/', function(req, res){
//     res.send('Root');
// });

// app.get('/mysqlTest', function(req, res){
//     pool.getConnection(function(err, con){
//         if(err) console.log(err.message);
//         pool.query("select * from clients where id = '" + 'nsw0311' + "'", function(err, rows){
//             if(err) console.log(err.message);
//             res.send(rows[0].name);
//             con.release();
//         })
//     })
// });

// app.listen(8080, function () {
//     console.log(8080 + ' 포트에서 대기중');
//   });



// // 시간 출력 테스트
// var moment = require('moment');
// require('moment-timezone');
// moment.tz.setDefault("Asia/Seoul");
// var now = moment().format('YYYY-MM-DD HH:mm:ss');
// console.log(now);



// 잡다한거?
// var alpha = 'abcde'
// var hangle = '가나다라마'

// for(var c in alpha){
//     console.log(alpha[c]);
// }
// for(var c in hangle){
//     console.log(hangle[c]);
// }

var express = require('express');
var app = express();
var http = require('http').Server(app); //1
var io = require('socket.io')(http);    //1

app.set('view engine', 'ejs');  //템플릿 엔진 세팅
app.set('views', './views');    //ejs 파일이 저장된 디렉토리

app.get('/',function(req, res){  //2
  res.render('test', {});
});

var count=1;
io.on('connection', function(socket){ //3
  console.log('user connected: ', socket.id);  //3-1
  var name = "user" + count++;                 //3-1
  io.to(socket.id).emit('change name',name);   //3-1

  socket.on('disconnect', function(){ //3-2
    console.log('user disconnected: ', socket.id);
  });

  socket.on('send message', function(name,text){ //3-3
    var msg = name + ' : ' + text;
    console.log(msg);
    io.emit('receive message', msg);
  });
});

http.listen(8080, function(){ //4
  console.log('server on!');
});