const express = require('express');
const router = express.Router();
var mysql = require('mysql');
//上传图片的模板
var multer = require('multer');

var path = require("path")


router.post('/getaaa', (req, res) => {
    res.send(JSON.stringify({
        code: 0,
        data: "1",
        msg: "保存成功"
    }))
})

router.post('/getbbb', (req, res) => {
    res.send(JSON.stringify({
        code: 0,
        data: "2",
        msg: "保存成功"
    }))
})

router.post('/getccc', (req, res) => {
    res.send(JSON.stringify({
        code: 0,
        data: "3",
        msg: "保存成功"
    }))
})

router.post('/getddd', (req, res) => {
    res.send(JSON.stringify({
        code: 0,
        data: "4",
        msg: "保存成功"
    }))
})


module.exports = router;