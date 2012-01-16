var home = {},
	ca = _rrest.mod.captcha,
	c_a_ary = _rrest.mod.captcha.captcha_ary;
home.index = function(req, res){
	var picid = req.getparam['picid'] || false;
	if(!picid || picid.length != 17) res.end('');
	else if (picid = ca.decode(picid)){
	var url = c_a_ary[picid-1].url+picid+'.png'
	res.sendfile(url,  function(error, file){
		if(error)  _logger.error('验证码图片显示error: ' + error);
		});
	}
	else res.end('')
	return true;
}
module.exports = home;