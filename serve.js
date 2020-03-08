//express_demo.js 文件
var express = require('express');
//主要的部分start
var bodyParser = require('body-parser'); //解析,用req.body获取post参数
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const jwt = require('jsonwebtoken'); //生成token

var path = require("path")
var fs = require("fs");

var areaList = require('./area')

var requestUrl = "192.168.0.104"

// app.use(express.static(path.join(__dirname,"./static")))

app.use('/uploads', express.static('./uploads'));

app.get('/uploads/*', function (req, res) {
  res.sendFile(__dirname + "/" + req.url);
})

var mysql = require('mysql');
app.use(bodyParser.urlencoded({
  extended: true
}));




const upload = require('./router/upload.js'); //路由
app.use('/upload', upload) //路由
const msgMan = require('./router/msgMan.js'); //路由信息列表
app.use('/msgMan', msgMan) //路由信息列表
const person = require('./router/person.js'); //路由信息列表
app.use('/person', person) //路由信息列表


const JwtUtil = require('./jwt');

app.use(function (req, res, next) {
  // 我这里知识把登陆和注册请求去掉了，其他的多有请求都需要进行token校验 
  if (req.url != '/login' && req.url != '/register') {
      let token = req.headers.token;
      let jwt = new JwtUtil(token);
      let result = jwt.verifyToken();
      // 如果考验通过就next，否则就返回登陆信息不正确
      if (result == 'err') {
          res.send({status: 403, msg: '登录已过期,请重新登录'});
          // res.render('login.html');
      } else {
          next();
      }
  } else {
      next();
  }
})
// 登录
var login_id = ""
app.post('/login',function (req, res) {
  res.writeHead(200, {
    "Content-Type": "text/html;charset=utf-8"
  })
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wobuzhidao123',
    database: 'mylog'
  });
  connection.connect();
  connection.query('select * from person', function (error, results, fields) {
    if (error) throw error;
    var temp = ''
    for (var i = 0; i < results.length; i++) {
      if (req.body.username == results[i].username && req.body.password == results[i].password) {
        temp = results[i].id
        login_id = results[i].id
        if( results[i].isdisabled == 0 ) { //停用
          res.end(JSON.stringify({
            code: 500,
            msg: "账号已停用"
          }));
        }
      }
    }
    let jwt = new JwtUtil(String(temp));
    const token = jwt.generateToken();
    if (temp != '') {
      var data = fs.readFileSync('./static/奇迹.txt');
      res.end(JSON.stringify({
        code: 0,
        msg: "登录成功",
        data: {
          text: data.toString()
        },
        token:token
      }));
    } else {
      res.end(JSON.stringify({
        code: 500,
        msg: "用户名或密码错误"
      }));
    }
  });
})
// 列表
app.post('/list',function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wobuzhidao123',
    database: 'mylog'
  });
  connection.connect();
  var addSql = "select * from logs where login_id =  "  + login_id; 
  var addSqlParams = [req.body.name, req.body.sex, req.body.age, req.body.idcard];
  connection.query(addSql, function (err, result) {
    if (err) {
      return;
    }
    res.end(JSON.stringify({
      code: "0",
      msg: "添加成功",
      data: result.reverse(),
      total: result.length
    }));
  });
})

// 列表
app.post('/query', verifyToken,function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wobuzhidao123',
    database: 'mylog'
  });
  connection.connect();
  var addSql = "select * from logs where login_id =  "  + login_id; 
  connection.query(addSql, function (err, result) {
    if (err) {
      return;
    }
    if (req.body.date == "" || req.body.date == null) {
      res.end(JSON.stringify({
        code: "0",
        msg: "添加成功",
        data: result,
        total: result.length
      }));
    } else {
      let temp = [];
      for (let i = 0; i < result.length; i++) {
        if (req.body.date == result[i].date.split(" ")[0]) {
          temp.push(result[i])
        }
      }
      res.end(JSON.stringify({
        code: "0",
        msg: "添加成功",
        data: temp,
        total: temp.length
      }));
    }

  });


})
//主要的部分end
app.post("/add", verifyToken,function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wobuzhidao123',
    database: 'mylog'
  });
  connection.connect();
  var addSql = 'INSERT INTO logs(title,content,date,login_id) VALUES(?,?,?,?)'; //新增语句
  var addSqlParams = [req.body.title, req.body.content, req.body.date,login_id];
  connection.query(addSql, addSqlParams, function (err, result) {
    if (err) {
      return;
    }
    res.end(JSON.stringify({
      code: "0",
      msg: "添加成功"
    }));
  });
})

//主要的部分end
app.post("/updata",verifyToken, function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wobuzhidao123',
    database: 'study'
  });

  connection.connect();

  var modSql = 'UPDATE user_info SET name = ?,sex = ?,age = ?,idcard = ? WHERE Id = ?';

  //   var  addSql = 'updata INTO user_info(name,sex,age,idcard) VALUES(?,?,?,?)';  //新增语句
  var addSqlParams = [req.body.name, req.body.sex, req.body.age, req.body.idcard, req.body.id];

  connection.query(modSql, addSqlParams, function (err, result) {
    if (err) {
      return;
    }
    res.end(JSON.stringify({
      code: "0",
      msg: "更新成功"
    }));
  });

})
//主要的部分end
app.post("/deleteInfo",verifyToken,function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  }); //解决输出乱码问题
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wobuzhidao123',
    database: 'mylog'
  });
  connection.connect();
  var addSql = 'delete from logs where id=' + req.body.id; //删除语句语句
  connection.query(addSql, function (err, result) {
    if (err) {
      return;
    }
    res.end(JSON.stringify({
      code: "0",
      msg: "删除成功"
    }));
  });

})
//验证token是否过期
function verifyToken(req, res, next) {
  
  const token = req.headers['token'];
  if(typeof token !== 'undefined') {
    const bearer = token.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    console.log("token没过期")
    next();
  } else {
    console.log("token已过期")
    res.sendStatus(403);
  }
}



var server = app.listen(8888, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})