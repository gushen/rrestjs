var http = require('http'),
	rrest = require('../'),
    server = http.createServer(rrest(function (req, res) {
		res.send(htmlstr);
	})).listen(3000);
var htmlstr = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'+
			  '<html xmlns="http://www.w3.org/1999/xhtml">'+
			  '<head>'+
			  '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'+
			  '<script src="/static/js.js"></script>'+
			  '<title>jsonp</title>'+
			  '</head><body>'+
			  '一个自动输出静态文件的例子'+
			  '<img src="/static/evo.jpg"/>'+
			  '</body></html>'