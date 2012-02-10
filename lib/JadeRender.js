var jade = require('jade'),
	RestUtils = require('./RestUtils'),
	fs = require('fs'),
	outerror = require('./Outerror'),
	charset = _restConfig.charset,
	jadeobj = {									//config设置读入
		tempFolder : _restConfig.tempFolder,
		isCache : _restConfig.jadeHtmlCache,
		CacheTime : _restConfig.jadeCacheTime,
		CacheFolder : _restConfig.jadeCacheFolder,
		BufferObj :{},
	},
	tempFolder = _restConfig.baseDir + jadeobj.tempFolder;//缓存文件存放目录
jadeobj.jadeHeader = function(res, html){//设置jadeer模版响应头
	var size = Buffer.byteLength(html, charset);
	res.setHeader('Content-Type', 'text/html; charset='+charset);
	res.setHeader('Content-Length', size);
};
jadeobj.renderFile = function(res, view, viewkey, options, fn, callback){
		var path = tempFolder + view, //jade模版存放地址
			options = options || {};			
		jade.renderFile(path, options, function(err, html){//输出jade模版
			if (err){
				RestUtils.errorRes(res, 'Jade render error!');//如果有错误响应500
				callback && callback(err);
				return fn(err);//用户回调
			}
			jadeobj.jadeHeader(res, html);//设置头部
			res.send(html);
			callback && callback(null, view, viewkey, html);
			fn(null, html);
		});
};
jadeobj.genCache = function(err, view, viewkey, html){//生成缓存映射表
	if(err){
		if(jadeobj.BufferObj[viewkey]) jadeobj.BufferObj[viewkey].key = 1;
		return 
	}//如果输出jade模版出错，则将key归还映射表
	var jo = jadeobj.BufferObj[viewkey],
		filename = jo.data = RestUtils.md5(viewkey); //生成文件名并将文件名放入 缓存映射表对应 viewkey 值的 key 中
		jo.timestamp = Date.now();//生成时间戳
	fs.writeFile(CacheFolder+'/'+filename, html, charset, function(err){//写入文件
		jo.key = 1;
		if(err){//如果出错，则删除缓存映射表的这个key，记录错误日志
			delete jo;
			outerror('Write jade_cache error: ' + view);
		}
	});
};
jadeobj.sendCache = function(res, view, viewkey, options, fn){ //响应缓存
	var filename = CacheFolder + '/' +jadeobj.BufferObj[viewkey].data; //拼装jade缓存文件地址
	fs.readFile(filename, charset, function(err, data){
		if(err){ //如果未找到缓存文件
			jadeobj.renderFile(res, view, viewkey, options, fn, jadeobj.genCache);//如果未找到文件则去生成文件
			return;
		}
		jadeobj.jadeHeader(res, data);
		res.send(data);
	})
};
if(jadeobj.isCache){//如果开启了jade html缓存
	var CacheFolder = _restConfig.baseDir + jadeobj.CacheFolder;  //拼装jade缓存文件目录
	module.exports = function(res, view, ispage, options, fn){
			var viewkey = ispage  + view, //ispage表示页码，防止缓存根据模版路径名保存一个让所有分页缓存都指向一个页面的bug
				jo = jadeobj.BufferObj[viewkey];//文件保存路径
			if(!jo){ //如果在缓存映射表中未找到记录
				jo = jadeobj.BufferObj[viewkey] = {key:0}; //生成映射表，并且将 更新缓存的 key 取走
				jadeobj.renderFile(res, view, viewkey, options, fn, jadeobj.genCache);//这里直接读取jade模版，并将 jadeobj.genCache 作为回调创建缓存，归还 key
			}
			else if(Date.now() - jo.timestamp >= jadeobj.CacheTime && jo.key === 1){ //如果找到映射表中的记录，但是 缓存已经失效 并且 生成缓存的key 还在。
				jo.key = 0;
				jadeobj.renderFile(res, view, viewkey, options, fn, jadeobj.genCache); //取走 key 生成缓存
			}
			else jadeobj.sendCache(res, view, viewkey, options, fn); //否则输出缓存
	};
}
else module.exports = jadeobj.renderFile;