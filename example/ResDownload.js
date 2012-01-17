var http = require('http'),
	rrest = require('../'),
    server = http.createServer(rrest(function (req, res) {
		res.download(__dirname+'/static/evo.jpg', function(err){
			if(!err) console.log('success！！！');
		})
	})).listen(3000);