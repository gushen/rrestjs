var AsyncProxy = require('./modules/AsyncProxy'),
	RestUtils = require('./RestUtils'),
	fs = require('fs'),
	compressCss = require('./modules/compressCss'),
	uglifyjs = function(str){//js压缩方法
		var jsp = require("uglify-js").parser,
		    pro = require("uglify-js").uglify;		
		    orig_code = str,
			ast = jsp.parse(orig_code); // parse code and get the initial AST
		ast = pro.ast_mangle(ast); // get a new AST with mangled names
		ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
		var final_code = pro.gen_code(ast); // compressed code here
		return final_code+';';
	},
	autoStatic = _restConfig.autoStatic,
	staticFolder = _restConfig.baseDir + _restConfig.staticFolder,	
	staticFolderPath = function(path){
		var po = path.lastIndexOf('/');
		return path.slice(0, po);
	}(staticFolder),
	staticParse = _restConfig.staticParse,
	staticParseName = _restConfig.staticParseName,
	staticParseCacheTime = _restConfig.staticParseCacheTime,
	staticParseCacheFolder = _restConfig.baseDir+_restConfig.staticParseCacheFolder
	reg = new RegExp("^/"+autoStatic+"/"),
	staticObj = {
		parseStaticCache:{},
		autoStaticFn:function(req, res){
			var filepath = staticFolder+'/'+req.path.slice(1).join('/'); //拼装静态目录
				res.sendfile(filepath);
		},
		parse:function(type, filePathArray, md5str, callback){
			var as = AsyncProxy(),//实例化异步代理库
				ary = [],//存放异步方法的数组	
				fileary = [],//存放buffer.toString()的css或js文档
				wrong = 0,
				readfile = function(value, index){
					return function(rec){
						fs.readFile(staticFolderPath+value, 'utf-8', function(err, data){
							if(err) wrong++;
							else{//坑爹的uglify，末尾不加';'号而且有错还得用户加try，我去提意见
								try{
									fileary[index] = zipFn(data);
								}
								catch(e){
									fileary[index] = data;
								}
							}
							rec();
						})
					};
				},
				allComplete = function(){
					if(wrong>0) return callback('Some of them is not existed!');
					fs.writeFile(staticParseCacheFolder+'/'+md5str, fileary.join(''), 'utf-8', function(err){
						if(err) return callback('Create CacheParse file error!');
						callback(null, staticParseCacheFolder+'/'+md5str);
						as = null;
					})
				};
				if(type === '.css'){
					var zipFn = compressCss;//css 压缩模块
				}
				else if(type === '.js'){
					var zipFn = uglifyjs;//js 压缩模块
				}
				else return callback('Only support parse css or js!');
				filePathArray = filePathArray.forEach(function(value, index){//为每一个路径添加fs访问路径
					var vtype = value.slice(value.lastIndexOf('.')).toLowerCase();
					if(!reg.test(value)) return wrong++;
					if(vtype !=='.css' && vtype !== '.js')  return wrong++;
					ary.push(readfile(value, index));					
				});	
				if(wrong>0) return callback('Can not parse these files, some of them has wrong url or is not css|js files!');
				ary.push(allComplete);
				as.ap.apply(as, ary);
			return true;				
		},
		createCache:function(type, filePathArray, md5str, res){//生成缓存的方法
			var callback = function(errmsg, filepath){//生成缓存以后的回调，如果有错误也会执行
					if(errmsg) return RestUtils.errorRes(res, errmsg);//如果生成缓存失败，则输出错误		
					staticObj.parseStaticCache[md5str] = {//如果正常返回，则创建和更新缓存
						timestamp:Date.now(),
						filepath:filepath,
					}
					res.sendfile(filepath);
				};
			staticObj.parse(type, filePathArray, md5str, callback);//根据生成缓存文件函数返回的路径输出缓存				
		},
	};
if(!staticParse){//如果没有开启静态文件整合功能则直接自动输出静态文件
	module.exports = staticObj.autoStaticFn;
}
else{//开启静态文件整合压缩
	module.exports = function(req, res){
		var parsePath = req.getparam[staticParseName];		
		if(!parsePath) return staticObj.autoStaticFn(req, res); //开启功能但未使用此方法，则直接自动输出
			var ary = parsePath.split('|'),
				type = ary[0].slice(ary[0].lastIndexOf('.')).toLowerCase(),
				md5str = RestUtils.md5(parsePath)+type,
				pobj = staticObj.parseStaticCache[md5str];
			if(ary.length>20) return RestUtils.errorRes(res, 'Can not parse too many files!');
			if(pobj && (Date.now() - staticParseCacheTime < pobj.timestamp)){//如果有缓存，并且缓存未超时,正常输出缓存文件			
				res.sendfile(pobj.filepath, function(err){
					if(err){
						outerror('Read cache staticParse file error: ' + err);
						staticObj.createCache(type, ary, md5str, res);//如果读取缓存失败，则去生成缓存
					}
				});

			}
			else{
				staticObj.createCache(type, ary, md5str, res);//去生成缓存
			}
	}
}
	