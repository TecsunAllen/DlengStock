/**
 * node-http 服务端
 */
let http = require('http');
let url = require('url');
let fs = require('fs');
let request = require('request');
let port = 90;




// 创建服务器
let server = http.createServer((req, res) => {
  // 解析请求
  let pathname = url.parse(req.url).pathname;
  if (pathname == '/GetUrlResultProxy') {
    var arg = url.parse(req.url, true).query;
    getUrlHttpsProxy(arg.url, function (result) {
      res.writeHead(200, { 'Content-type': 'text/json;charset=utf-8', 'Access-Control-Allow-Origin': '*' });
      res.write(result);
      res.end();
    });
  }
  else {
    if (pathname == '/') pathname = '/dist/index.html';
    else pathname = '/dist' + pathname;
    fs.readFile(pathname.substr(1), (err, data) => {
      if (err) {
        console.log('文件读取失败：' + err);
        res.writeHead(404, {
          'Content-Type': 'text/html'
        });
      }
      else {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        res.write(data.toString());
      }
      res.end();
    });
  }
});


var cookies = "";
initCookie();
function initCookie() {
  var option = {
    url: 'https://xueqiu.com/'
  };
  request(option, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      cookies = response.headers['set-cookie'].toString();
    }
  });
}

function getUrlHttpsProxy(url, callback) {
  var option = {
    url,
    headers: {
      'Cookie': cookies,
    }
  };
  request(option, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if (callback) callback(body);
    }
  });
}

server.listen(port);

console.log(`服务运行在：http://localhost:${port}`);