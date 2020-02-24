// var http = require('http');
// http.createServer(function(request,respose){
    
//     respose.writeHead(200,{'Content-Type':'text/plain'})
//     respose.end('Holle Wrold')
// }).listen(8888)
// // 终端打印如下信息
// console.log('Server running at http://127.0.0.1:8888/');

var originRequest = require('request');
var iconv = require('iconv-lite');
var express = require('express');
var cheerio = require("cheerio");
var bodyParser = require('body-parser');

var app = express();
app.use(express.static("./"));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
    extended: true
}));
var headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
}
var url = 'https://voice.baidu.com/act/newpneumonia/newpneumonia';
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200); //让options尝试请求快速结束
    else
        next();
})
function Request(url, callback) {
    var options = {
        url: url,
        encoding: null,
        headers: headers
    }
    originRequest(options, callback)
}
app.get("/get", function (request, response) {
  Request(url, function (err, res, body) {
      if (err) {
          console.log(err);
      }
       var html = iconv.decode(body, 'gb2312')
       var $ = cheerio.load(html, {
           decodeEntities: false
       })
      response.json($('#captain-config').html()); 
    })
});
app.listen(3030, function () {
    console.log('localhost:3030')
});

