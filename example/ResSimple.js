var http = require('http'),
	rrest = require('../'),
    server = http.createServer(rrest(function (req, res) {
		res.cache('public', 10000);
		res.clearcookie('rrSid');
		res.cookie('RestSpout', 'I am coming!');
		
		//res.redirect('http://www.baidu.com')

		//res.send('<body>API</body>');
		res.sendjson({name:'spout', age:27},200, false, false);		  
	})).listen(rrest.config.listenPort);