var http = require('http'),
	util = require('util'),
	rrest = require('../'),
    server = http.createServer(rrest(function (req, res) {
			if(req.method === 'POST'){
					res.write('<body>');
					res.write(formstr)
					res.write('<b>we get post data down list:</b><br /><br />');
					res.write('req.path:'+req.path+'<br />');
					res.write('req.ip:'+req.ip+'<br />');
					res.write('req.referer or req.referrer:'+req.referer+'<br />');
					res.write('req.UserAgent:'+req.useragent+'<br />');
					res.write('req.GetParam:'+JSON.stringify(req.getparam)+'<br />');
					res.write('req.cookie:'+JSON.stringify(req.cookie)+'<br />');
					res.write('<br/><br/><b>we got the multiform data down list:</b><br/><br/>')
					res.write(util.inspect(req.MultiForm));
					res.end('</body>');
			}
			else{
					res.write('<body>');
					res.write(formstr)
					res.write('<b>we get post data down list:</b><br /><br />');
					res.write('req.path:'+req.path+'<br />');
					res.write('req.ip:'+req.ip+'<br />');
					res.write('req.referer or req.referrer:'+req.referer+'<br />');
					res.write('req.UserAgent:'+req.useragent+'<br />');
					res.write('req.GetParam:'+JSON.stringify(req.getparam)+'<br />');
					res.write('req.PostParam:'+JSON.stringify(req.postparam)+'<br />');
					res.write('req.cookie:'+JSON.stringify(req.cookie)+'<br />');
					res.end('</body>');
				
			}

	})).listen(3000);
var formstr = '<form enctype="multipart/form-data" action="/user/name?method=post" method="post">'+
			  '<input type="text" name="input_name" value="spout" /><br/><br/>'+
			  '<input type="password" name="password" value="password" /><br/><br/>'+
			  '<input type="file" name="img" value="" /><br/><br/>'+
			  '<button type="submit">submit</button></form><br/><br/><br/><br/>';