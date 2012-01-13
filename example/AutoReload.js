var http = require('http'),
	rrest = require('../'),
	cp = rrest.ClusterPlus({
		CreateCallback:function(err, data){
			if(err) return console.log(err);	
			//writen server listen function here
			var	server = http.createServer(rrest(function (req, res){
					res.send('process '+data.num+' is working : hello world everyone!!!!!!!!!!!!!!!!!!!!!!!!');
				})).listen(3000);		
		},
		DeadCallback:function(err, data){
			if(err) return console.log(err);
			console.log('process '+data.num + ' is died!');
		},
		RestartCallback:function(err, data){
			if(err) return console.log(err);
			console.log('process '+data.num + ' has restarted!');
		},
	});

if(cp.isMaster){
	setTimeout(function(){console.log(cp.workobj);
	},3000)
}


