const express = require('express');
const router = express.Router();
var mysql = require('mysql');

router.post('/personlist',check, (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wobuzhidao123',
    database: 'mylog'
  });

  connection.connect();

  var addSql = 'select * from person'; //新增语句
  //var addSqlParams = [req.file.fieldname, req.file.encoding, req.file.originalname, req.file.mimetype, req.file.destination, req.file.filename, req.file.path, req.file.size];
  connection.query(addSql, function (err, result) {
    if (err) throw err;
    console.log("personlist------------",result)
    res.send(JSON.stringify({
      code: 0,
      data: result,
      msg: "保存成功"
    }))
  });
})
router.post('/personupdate', check,(req, res) => {

    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
      });
       if( req.body.id == 1 ) {
        res.end(JSON.stringify({
            code: 500,
            msg: "系统账号不能修改"
          }));
          return
       }
         var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'wobuzhidao123',
        database: 'mylog'
      });
       
      connection.connect();
    
      var modSql = 'UPDATE person SET isdisabled = ? WHERE Id = ?';
    
      //   var  addSql = 'updata INTO user_info(name,sex,age,idcard) VALUES(?,?,?,?)';  //新增语句
      var addSqlParams = [req.body.isdisabled, req.body.id];
    
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

  router.post('/persondelete', check,(req, res) => {

    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
      });
       if( req.body.id == 1 ) {
        res.end(JSON.stringify({
            code: 500,
            msg: "系统账号不能修改"
          }));
          return
       }
         var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'wobuzhidao123',
        database: 'mylog'
      });
       
      connection.connect();
    
      var modSql = 'delete from person  WHERE id = ' + req.body.id;
    
      //   var  addSql = 'updata INTO user_info(name,sex,age,idcard) VALUES(?,?,?,?)';  //新增语句
      var addSqlParams = [req.body.isdisabled, req.body.id];
    
      connection.query(modSql, function (err, result) {
        if (err) {
          return;
        }
        res.end(JSON.stringify({
          code: "0",
          msg: "删除成功"
        }));
      });
  })
  //主要的部分end
  router.post("/personAdd",check,function (req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });
    console.log(req.body)
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'wobuzhidao123',
      database: 'mylog'
    });
    connection.connect();
    var addSql = 'INSERT INTO person(name,idcard,address,username,password,phone,isdisabled) VALUES(?,?,?,?,?,?,?)'; //新增语句
    var addSqlParams = [req.body.name, req.body.idcard, req.body.address,req.body.username,req.body.password,req.body.phone,"1"];
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

  function check(req, res, next) {
    const JwtUtil = require('../jwt');
    console.log("进来了")
    // 我这里知识把登陆和注册请求去掉了，其他的多有请求都需要进行token校验 
    if (req.url != '/login' && req.url != '/register') {
        let token = req.headers.token;
        let jwt = new JwtUtil(token);
        let result = jwt.verifyToken();
        // 如果考验通过就next，否则就返回登陆信息不正确
        if (result == 'err') {
            console.log(result);
            res.send({status: 403, msg: '登录已过期,请重新登录'});
            // res.render('login.html');
        } else {
          console.log("没过期")
            next();
        }
    } else {
        next();
    }
  }
module.exports = router;