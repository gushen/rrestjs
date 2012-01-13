var http = require('http'),
	rrest = require('../'),
	cp = rrest.ClusterPlus({
		CreateCallback:function(err, data){
			if(err) return console.log(err);	
			//writen server listen function here
//core code
			var	server = http.createServer(rrest(function (req, res){
					var session = req.session;
					if(session.count>10){
						req.delsession();
						res.send('process '+data.num+' (process.pid : '+process.pid+' ) is working: session count 11 has deleted!');
						return
					}
					if(!session.count){
						session.count = 0;
					}					
					res.send('process '+data.num+' (process.pid : '+process.pid+' ) is working: session.count'+(++session.count));
				})).listen(3000);		
//core code
		},
		DeadCallback:function(err, data){
			if(err) return console.log(err);
			console.log('process '+data.num + ' is died!');
		},
		RestartCallback:function(err, data){
			if(err) return console.log(err);
			console.log('process '+data.num + ' has restarted!');
		},
		logger:true,
		num:8,
	});

if(!cp.isMaster){
	setInterval(function(){
		console.log(process.pid + ' : '+JSON.stringify(_restSession));
	},3000)
}