const express = require('express');
const router = express.Router();
var mysql = require('mysql');

router.post('/getMsgList', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wobuzhidao123',
    database: 'messagemanagement'
  });

  connection.connect();

  var addSql = 'select * from msg'; //新增语句
  //var addSqlParams = [req.file.fieldname, req.file.encoding, req.file.originalname, req.file.mimetype, req.file.destination, req.file.filename, req.file.path, req.file.size];
  connection.query(addSql, function (err, result) {
    if (err) throw err;
    console.log("allList------------",result)
    res.send(JSON.stringify({
      code: 0,
      data: {
          dataList:result
      },
      msg: "保存成功"
    }))
  });
})
module.exports = router;