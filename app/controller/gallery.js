var home = {},
    path = _rrest.config.baseDir + _rrest.config.tempFolder+'/gallery';
home.index = function(req, res, pathobj){
	res.render('/gallery/index.jade', {pagetitle:_rrest.config.webtitle+'-作品秀'});
	return true;
}
home.plus = function(req, res){
	res.sendfile(path+'/plus.html');//输出静态文件
	return true;
}
home.asyncproxy = function(req, res, pathobj){
	res.render('/gallery/asyncproxy.jade',{pagetitle:_rrest.config.webtitle+'-AsyncProxy详解'});
	return true;
}
home.waterfall = function(req, res, pathobj){
	res.sendfile(path+'/waterfall.html');//输出静态文件
	return true;
}
home.picshow = function(req, res, pathobj){
	res.sendfile(path+'/picshow.html');//输出静态文件
	return true;
}
home.slidershow = function(req, res, pathobj){
	res.sendfile(path+'/slidershow.html');//输出静态文件
	return true;
}
home.walk = function(req, res, pathobj){
	res.sendfile(path+'/walk.html');//输出静态文件
	return true;
}
module.exports = home; 