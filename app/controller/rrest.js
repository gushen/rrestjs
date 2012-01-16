var home = {}
home.index = function(req, res){
	var title = _rrest.config.webtitle+'-API';
	res.render('/rrest/index.jade', {pagetitle:title});
	return;
}
module.exports = home; 