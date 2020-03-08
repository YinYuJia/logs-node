var fs = require("fs");

module.exports = {

    readfileSync : function(path){//同步读取
        var data = fs.readFileSync(path,'utf-8');
    },

    readfile : function(path,recall){//异步执行
        fs.readFile(path,function(err,data){
            if(err){
                console.log(err);
            }else{
                recall(data);   //回调recall函数，它是闭包函数，它会存储原来的response对象
            }
        });

    },

    readImg : function(path,res){
        fs.readFile(path,'binary',function(err,file){
            if(err){
                console.log(err);
                return ;
            }else{
                res.write(file,'binary');
            }
        });
    }
}
