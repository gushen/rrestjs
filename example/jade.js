var http = require('http'),
	rrest = require('../'),
    server = http.createServer(rrest(function (req, res) {
		res.render('/index.jade', {"t":'hello world'}, function(err, html){

		})
	})).listen(3000);
