var home = {},
	title = _rrest.config.webtitle;
home.index = function(req, res){
	res.render('/index/index.jade', {pagetitle:title+'-首页'});
	return;
}
home.api = function(req, res){
	res.render('/index/api.jade', {pagetitle: title+'-API'});
	return;
}
home.testing = function(req, res){
	res.render('/index/testing.jade', {pagetitle:title+'-性能测试'});
	return;
}
home.compare = function(req, res){
	res.render('/index/compare.jade', {pagetitle:title+'-对比表'});
	return;
}
module.exports = home; 