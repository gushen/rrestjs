var http = require('http'),
	rrest = require('../'),
    server = http.createServer(rrest(function (req, res){
		res.write('<body>');
		res.write('req.path:'+req.path+'<br />');
		res.write('req.ip:'+req.ip+'<br />');
		res.write('req.referer or req.referrer:'+req.referer+'<br />');
		res.write('req.UserAgent:'+req.useragent+'<br />');
		res.write('req.GetParam:'+JSON.stringify(req.getparam)+'<br />');
		res.write('req.PostParam:'+JSON.stringify(req.postparam)+'<br />');		
		res.write('req.cookie:'+JSON.stringify(req.cookie)+'<br />');
		res.write('<script>document.cookie = "name = spout"</script>');
		res.end('</body>');
	})).listen(rrest.config.listenPort);