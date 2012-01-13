var fs = require('fs'),
    RestUtils = require('./RestUtils'),
    icon ={
		DefaultPath:_restConfig.baseDir+_restConfig.favicon,
		maxAge : _restConfig.statciMaxAge,
		faviconUrl: _restConfig.favicon,
		icon : false,
	};

icon.SendFavicon = module.exports = function favicon(res, path){//输出favicon
	 var path = path || icon.DefaultPath; 
     if(icon.icon)  return icon.Response(true, res); //如果有缓存，则输出缓存
 	 fs.readFile(path, function(err, buf){ //没有则去读取文件
		  if(err)  return RestUtils.errorRes(res, 'Response favicon.ico error!'); //出错响应500
		  icon.Response(false, res, buf); //无缓存响应
	 });
	 return false;
  };
 icon.Response = function(iscache, res, buf){
			if(!iscache){
				  icon.icon = { //设置头信息
					headers: {
						'Content-Type': 'image/x-icon'
					  , 'Content-Length': buf.length
					  , 'ETag': '"' + RestUtils.md5(buf) + '"'
					  , 'Cache-Control': 'public, max-age=' + (icon.maxAge / 1000)
					},
					body: buf
				  };	
			}
			res.writeHead(200, icon.icon.headers);
			res.end(icon.icon.body);
			return true;
 }
