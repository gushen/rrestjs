var	parse = require('url').parse, //读取配置，加速加载
	RestUtils = require('./RestUtils'),
	postLimit = require('./RestPostLimit'),//post方法的判断
	serverName = _restConfig.server,
	poweredBy = _restConfig.poweredBy,
	faviconUrl = _restConfig.favicon,
	staticFolder = _restConfig.baseDir + _restConfig.staticFolder,
	staticStr = _restConfig.autoStatic,
	IPfirewall = _restConfig.IPfirewall,
	ExceptIP = _restConfig.ExceptIP,
	ExceptPath = _restConfig.ExceptPath,
	NotAllow = _restConfig.NotAllow,
	isSession = _restConfig.isSession,
	worksession = function(req, res, callback){
		req.getsession(function(err, sobj){	
					if(err || !sobj){
						res.gensession({},function(err, obj){
							if(!err) req.session = obj;
							callback(req, res);
						});
					} 
					else {
						req.session = sobj;
						callback(req, res);
					}							
			});				
	},
	bridge = function(req, res, callback){//核心入口处
		res._restReq = req;  //让res也能取到req对象
		req._restRes = res;  //让req也能取到res对象
		res.setHeader('Server', serverName);//设置通用响应头
		res.setHeader('X-Powered-By', poweredBy);	
		if(req.url === faviconUrl) res.favicon(); //如果是favicon请求，自动响应
		else if(req.path[0] === staticStr){ //如果是请求静态文件，自动响应静态文件，这里为了效率只能设定一个静态目录
			var filepath = staticFolder+'/'+req.path.slice(1).join('/'); //拼装静态目录
			res.sendfile(filepath);
		}
		else if(req.method === 'POST'){ //如果是POST提交数据，则需要经过multiform
			postLimit(req, res, function(err, req, res){//判断post请求是否合理设置了content-length和超过大小
				if(err) return RestUtils.errorRes(res, err);
				req.GetMultiPost(function(MultiForm){
					req.file = MultiForm.file;
					if(isSession) worksession(req, res, callback);
					else callback(req, res);
				});
			});				
		}
		else{
			if(isSession) worksession(req, res, callback);//如果打开session支持，则执行以下，会影响效率
			else callback(req, res);
		}
	};
	
if(IPfirewall){ //如果开启了IP过滤
		module.exports = function(callback){
			return function(req, res){
				if(ExceptPath.length>0){ //如果设置了例外的目录
					var uri = parse(req.url).pathname,
						allow = ExceptPath.some(function(val){
							return uri.indexOf(val) === 0;
						});
					if(allow) bridge(req, res, callback); //访问的是例外的目录，正常响应
					else if(req.ip && ExceptIP.test(req.ip)) bridge(req, res, callback); //如果不再过滤路径内，但是ip在过滤内
					else RestUtils.forbidden(res, NotAllow);
				}
				else if(req.ip && ExceptIP.test(req.ip))  bridge(req, res, callback);
				else RestUtils.forbidden(res, NotAllow);				
			}
		};
}
else{
		module.exports = function(callback){
			return function(req, res){
				bridge(req, res, callback);
			}
		};
}