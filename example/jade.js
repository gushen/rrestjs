module.exports._conf = require('./config/jade.conf.js');
var http = require('http'),
	rrest = require('../'), 
	i=0,
    server = http.createServer(rrest(function (req, res) {
		res.render('/index.jade', ++i, {"t":'hello world'}, function(err, html){
			console.log(err);
			console.log(html);
		});
	})).listen(rrest.config.listenPort);
