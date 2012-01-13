var zlib = require('zlib'), //加载gzip模块
    RestZlib  = {
		iszilb:_restConfig.isZlib, //全局设置是否开启gzip
	};
 RestZlib.send = function(res, body, type){
	if(!type) return res.end(body);//出错正常输出
	res.setHeader('content-encoding', type);
	zlib[type.toLowerCase()](body, function(err, data){ //调用delate或者gzip方法
		if(err) return res.end(body); //出错正常输出
		res.setHeader('Content-Length', data.length);
		res.end(data);
	})
	return true;
}	
 RestZlib.check = function(acceptEncoding){ //判断gzip
	if(!RestZlib.iszilb || !acceptEncoding) return false;
	if(~acceptEncoding.toLowerCase().indexOf('deflate')) return 'Deflate'; //优先使用deflate
	else if(~acceptEncoding.toLowerCase().indexOf('gzip')) return 'Gzip';
	return false;
 }
module.exports = RestZlib;