var http = require('http'),
	rrest = require('../'),
    server = http.createServer(rrest(function (req, res) {
				var session = req.session;
					if(!session.count){
						session.count = 0;
					}	
					if(session.count>10){
						req.delsession();
						res.send('session 到 11 了，被删除！');
						return;
					}
				 res.send(++session.count);
	})).listen(3000);
	
	setInterval(function(){
		console.log(process.pid + ' : '+JSON.stringify(_restSession));
	},3000)
