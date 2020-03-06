// 引入模块依赖
const fs = require('fs');
const path = require('path');
let jwt1 = require('jsonwebtoken');
// 创建 token 类
class Jwt {
    constructor(data) {
        this.data = data;
    }

    //生成token
    generateToken() {
        let data = this.data;
        let created = Math.floor(Date.now() / 1000);
        let cert = "YINYUJIA"
        console.log("到这里了")
        let token = jwt1.sign({
            data,
            exp: created + 60 * 1, //设置过期时间
        }, cert );
        return token;
    }
    // 校验token
    verifyToken() {
        let token = this.data;
        let cert = "YINYUJIA"
        let res;
        try {
            let result = jwt1.verify(token, cert) || {};
            let {exp = 0} = result, current = Math.floor(Date.now() / 1000);
            if (current <= exp) {
                res = result.data || {};
            }
        } catch (e) {
            res = 'err';
        }
        return res;
    }
}

module.exports = Jwt;