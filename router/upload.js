const express = require('express');
const router = express.Router();
var mysql = require('mysql');
//上传图片的模板
var multer = require('multer');

var path = require("path")
//生成的图片放入uploads文件夹下
var upload = multer({
  dest: 'uploads/'
})
//图片上传必须用post方法
var fs = require("fs");
router.post('/img', upload.single('file'), (req, res) => {
  //读取文件路径
  fs.readFile(req.file.path, (err, data) => {
    //如果读取失败
    if (err) {
      return res.send('上传失败')
    }
    //如果读取成功
    //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性
    let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
    //拓展名
    let extname = req.file.mimetype.split('/')[1]
    //拼接成图片名
    let keepname = time + '.' + extname
    //三个参数
    //1.图片的绝对路径
    //2.写入的内容
    //3.回调函数
    fs.writeFile(path.join(__dirname, '../uploads/' + keepname), data, (err) => {
      console.log("............",__dirname, '../uploads/' + keepname)
      if (err) {
        return res.send('写入失败')
      }

      // 写入数据库
      var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'wobuzhidao123',
        database: 'study'
      });
      connection.connect();
      var addSql = 'INSERT INTO pic_list(name) VALUES(?)'; //新增语句
      var addSqlParams = [
        keepname, 
        ];
      connection.query(addSql, addSqlParams, function (err, result) {
        if (err) throw err;
        // 返回前端文件名
        connection.query("SELECT * FROM pic_list where name = " + "\'"+keepname + "\'" , function (err, result) {
          if (err) throw err;
          // 返回前端文件名
          res.send({
            code: 0,
            data: result[0]
          })
        });
      });
    });
  });
})

router.post('/getImg', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wobuzhidao123',
    database: 'study'
  });

  connection.connect();

  var addSql = 'select * from pic_list where id = ' + req.body.id; //新增语句
  //var addSqlParams = [req.file.fieldname, req.file.encoding, req.file.originalname, req.file.mimetype, req.file.destination, req.file.filename, req.file.path, req.file.size];
  connection.query(addSql, function (err, result) {
    if (err) throw err;
    res.send(JSON.stringify({
      code: 0,
      data: "http://localhost/uploads/" +result[0].name,
      msg: "保存成功"
    }))
  });


})
router.post('/save', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wobuzhidao123',
    database: 'study'
  });

  connection.connect();

  var addSql = 'select * from pic_list'; //新增语句
  //var addSqlParams = [req.file.fieldname, req.file.encoding, req.file.originalname, req.file.mimetype, req.file.destination, req.file.filename, req.file.path, req.file.size];
  connection.query(addSql, function (err, result) {
    if (err) throw err;
    res.send(JSON.stringify({
      code: 0,
      data: req.file,
      msg: "保存成功"
    }))
  });


})
router.post('/getAllImgList', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wobuzhidao123',
    database: 'study'
  });

  connection.connect();

  var addSql = 'select * from pic_list'; //新增语句
  //var addSqlParams = [req.file.fieldname, req.file.encoding, req.file.originalname, req.file.mimetype, req.file.destination, req.file.filename, req.file.path, req.file.size];
  connection.query(addSql, function (err, result) {
    if (err) throw err;
    console.log("allList------------",result)
    let temp = []
    for ( var i = 0 ; i < result.length ; i++) {
      temp.push({
        id:result[i].id,
        name: "http://localhost:8888/uploads/" +result[i].name,
      })
    }
    res.send(JSON.stringify({
      code: 0,
      data: temp.reverse(),
      msg: "保存成功"
    }))
  });


})
module.exports = router;