var http = require('http'),
	rrest = require('../'),
    server = http.createServer(rrest(function (req, res) {
			
	})).listen(3000);