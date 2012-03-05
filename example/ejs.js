module.exports.config = require('./config/autoReuqire.conf.js');
var http = require('http'),
	rrest = require('../'), 
    server = http.createServer(rrest(function (req, res) {
		res.render('/index.ejs', {names:['foo', 'bar', 'baz']}, function(err, html){
			console.log(err);
			console.log(html);
		});
	})).listen(rrest.config.listenPort);
