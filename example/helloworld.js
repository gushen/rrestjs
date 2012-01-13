var cluster = require('cluster');
var numCPUs = 8;
if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('death', function(worker) {
    console.log('worker ' + worker.pid + ' died');
  });
} else {
var fs = require('fs');
var http = require('http'),
	rrest = require('../'),
    server = http.createServer(rrest(function (req, res){
		  //res.sendfile('/website/nginx/www/rrw_II_dev/index.html');

		  res.render('/index.jade', {"t":'hello world'});
	})).listen(3000);
}










