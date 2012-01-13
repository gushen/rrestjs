var http = require('http'),
	rrest = require('../'),
    server = http.createServer(rrest(function (req, res) {
		res.send('123456789012345678901234567890', 200);	  
	})).listen(3000);