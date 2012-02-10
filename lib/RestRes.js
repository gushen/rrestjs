var fs = require('fs'),
	http = require('http'),
    path = require('path'),
    RestUtils = require('./RestUtils'),
    mime = require('mime'),
	sendfile = require('./RestStatic'),
	sendfavicon = require('./RestFavicon'),
	restzlib = require('./RestZlib'),
	configZlib = _restConfig.isZlib,
	RestSession = require('./RestSession'),
	sessionName = RestSession.sessionName,
	tempSet = _restConfig.tempSet,
	JadeRender = require('./JadeRender'),
    RestRes  = module.exports = function(){
		if(!(this instanceof arguments.callee)) return new arguments.callee();
		this.res = http.ServerResponse.prototype;
		this._restResMethod = ['cache', 'send', 'sendjson', 'sendjsonp', 'sendfile', 'contenttype', 'download', 'attachment', 'set', 'get', 'clearcookie', 'cookie', 'cookiep3p', 'redirect', 'render', 'favicon'];
		if(RestSession.isSession) this._restResMethod.push('gensession', 'updatesession', 'delsession'); //如果开启session支持
		this._restdefine(this.res, this._restResMethod); //定义res对象的方法
  }; 
RestRes.prototype={
		_cache:function(res, type, maxAge){ //设置缓存头，如果想要此请求被缓存
			  var option = option || {};
			  if (maxAge) type += ', max-age=' + (maxAge / 1000); 
			  this._set(res, 'Cache-Control', type);
			  return res;
		},
		_send:function(res, body, statscode, iszlib, issession){ //核心函数，响应buffer或者字符串
				  var type,
					  req = res._restReq,
					  acceptEncoding = req.headers['accept-encoding'],
					  issession = 'undefined' == typeof issession? true : issession,
					  body = body+'' || '';  
				  if(statscode) res.statusCode = statscode;	//如果传递了http状态码
				  if(RestSession.isSession && issession) res.updatesession(req._restSessionObj); //更新session
				  if(204 == res.statusCode || 304 == res.statusCode) {
					res.removeHeader('Content-Type');
					res.removeHeader('Content-Length');
					body = '';
				  }
				  else if(!res.getHeader('Content-Type')) res.setHeader('Content-Type', ' text/html');		
				  this._sercookie(res);//发送cookie
				  if('undefined' === typeof iszlib) var iszlib = configZlib;//如果未单独传递gizp，则使用默认规则
				  if(iszlib && (type = restzlib.check(acceptEncoding))) restzlib.send(res, body, type); //是否使用gizp输出
				  else res.end(body);//正常输出
				  return res;
		},
		_sendjson:function(res, obj, statscode, iszlib, issession){ //json字符串输出	  
				  this._contenttype(res, '.json');
				  this._send(res, JSON.stringify(obj), statscode, iszlib, issession);
				  return res;
		},
		_sendjsonp:function(res, obj, statscode, iszlib, issession){//jsonp支持，参数必须为小写的 callback
			var body = JSON.stringify(obj);
				callback = res._restReq.getparam['callback'];
			res.setHeader('Content-Type', 'text/javascript');
			if(callback){
				body = callback.replace(/[^\w$.]/g, '') + '(' + body + ');';
				this._send(res, body, statscode, iszlib, false);
			}
			else res.send('To use rrestjs jsonp need param "callback".');
			return res;
		},
		_sendfile:function(res, filepath, callback){//响应文件
			if(!filepath) return callback('filepath must require!');
			sendfile(res, filepath, callback);
			return res;
		},
		_contenttype:function(res, filename){ //设置  Content-Type 的值
			 var charset = res.charset || _restConfig.charset;
			 res.setHeader('Content-Type', mime.lookup(filename)+'; '+charset);
			 return res;
		},
		_attachment:function(res, filename){ //设置下载头
			  if(filename) this._contenttype(res, filename);
			  res.setHeader('Content-Disposition', 'attachment; filename="' + path.basename(filename) + '"');
			  return this;
		},
		_download:function(res, filepath, fn){ //响应下载
				  this._attachment(res, filepath)._sendfile(res, filepath, fn);
				  return res;
		},
		_set:function(res, field, val){ //设置响应头
					if (3 == arguments.length) res.setHeader(field, val);
					else for (var key in field) res.setHeader(key, field[key]);
					return res;
		},
		_get:function(res, field){ //获得响应头
				res.getHeader(field);
				return res;
		},
		_clearcookie:function(res, name){  //清除cookie
				var opts = { expires: new Date(1), path: '/' };
				this._cookie(res, name, '', opts);
				return res;
		},
		_cookie:function(res, name, val, options){ //设置cookie
			var options = options || {};
			if ('object' == typeof val) val = 'j:' + JSON.stringify(val);
			if (options.maxAge) options.expires = new Date(Date.now() + options.maxAge);
			if (null == options.path) options.path = '/';
			var cookie = RestUtils.serializeCookie(name, val, options);
			if(!res._restcookieobj) res._restcookieobj = {};
			res._restcookieobj[name] = {
				name:name,
				val:val,
				options:options,
			}
			return res;
		},
		_cookiep3p:function(res){
			 res.setHeader('p3p', 'CP="CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA PRE COM NAV OTC NOI DSP COR"')
			return res;
		},
		_sercookie:function(res){
			if(!res._restcookieobj) return;
			var cookiestr = '', co,coarray=[];
			for(var j in res._restcookieobj){
				co = res._restcookieobj[j];
				coarray.push(RestUtils.serializeCookie(j, co.val, co.options));
			}
			res.setHeader('Set-Cookie',  coarray);
		},
		_redirect:function(res, url){ //跳转
			  this._set(res, {'Location':url, 'Content-Type':'text/plain'}).statusCode = 302;
			  res.end('Redirecting to ' + url);
			  return res;
		},
		_render:function(res, view, ispage, options, fn){ //输出模版
			if(arguments.length === 4){ //如果传递参数是4个，表示此页面无需分页，则ispage设置为空
				var options = ispage,
					fn = options,
					ispage = '';
			}
			var fn = fn||function(){};
			if(tempSet === 'jade') JadeRender(res, view, ispage||'', options, fn); //输出jade模版
			return res;
		},
		_favicon:function(res, filepath){ //输出favicon
			sendfavicon(res, filepath);		
			return res;
		},
		_gensession:function(res, obj, callback){ //创建sessionid入口
			var callback = callback || function(){},
				obj = obj || {};
			return RestSession.genSession(obj, function(err, _restsid, sobj){
				res._restReq._restSessionObj = sobj; //更新req对象的 _restSessionObj 对象，因为第一次创建，否则为 undefined
				res.cookie(sessionName, _restsid, {maxAge: RestSession.expire}); //设置cookie
				callback(err, sobj);
			});
		},
		_updatesession:function(res, obj){ //更新session
			if(obj && obj._restsid){
				var _restsid = obj._restsid;
				res.cookie(sessionName, _restsid, {maxAge: RestSession.expire});
				RestSession.updateSession(_restsid, obj);
			}
			return res;
		},
		_delsession:function(res){ //删除session
			var _restsid = this._restgetSessionId(res);
			if(_restsid){
				res.cookie(sessionName, _restsid, {maxAge:-1});
				RestSession.delSession(_restsid);
			}
			return res;
		},
		_restgetSessionId:function(res){ //根据请求对象，获得sessionid
			return  RestUtils.parseJSONCookies(RestUtils.parseCookie(res._restReq.headers.cookie||''))[sessionName] || false;
		},
		_restdefine:function(res, array){ //定义res的方法
			var that = this;
			array.forEach(function(value, i){
				res[value] = (function(value){
					return function(){
						var arg = Array.prototype.slice.apply(arguments);
						arg.unshift(this);
						return that['_'+value].apply(that, arg);
					}
				})(value)
			});
		},
	};