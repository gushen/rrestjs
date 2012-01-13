var http = require('http'),
	rrest = require('../'),
	port = [3000, 3001, 3002, 3003],
	cp = rrest.ClusterPlus({
		CreateCallback:function(err, data){
			if(err) return console.log(err);	
			//writen server listen function here
			var	server = http.createServer(rrest(function (req, res){
					res.send('process '+data.num+' is listen at '+port[data.num]+' : hello world everyone!');
				})).listen(port[data.num]);		
		},
		DeadCallback:function(err, data){
			if(err) return console.log(err);
			console.log('process '+data.num + ' is died!');
		},
		RestartCallback:function(err, data){
			if(err) return console.log(err);
			console.log('process '+data.num + ' has restarted!');
		},
		num:4,//also set at config.js
	});

if(cp.isMaster){
	setTimeout(function(){console.log(cp.workobj);
	},3000)
}


