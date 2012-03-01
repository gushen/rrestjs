/*
*JadeRender.js 是ejs模版输出的文件
*
*/

var jade = require('jade'),
	RestUtils = require('./RestUtils'),
	templateRender = require('./templateRender'),
	msg =  require('./msg/msg'),
	fs = require('fs'),
	outerror = require('./Outerror'),
	tempFolder = _restConfig.baseDir + _restConfig.tempFolder;//缓存文件存放目录
	module.exports = function(res, view, ispage, options, fn){
		templateRender(view, ispage, function(err, iscache, html){
			if(err) RestUtils.errorRes(res, msg.resmsg.jadeRenderError);//如果有错误响应500
			else{//console.log(html)
				if(iscache) res.send(html);
				else {//如果不是缓存，则编译jade模版再输出
					var jr = jade.compile(html, {filename:tempFolder+view+ispage, pretty: true });
					html = jr(options);
					templateRender.tempHeader(res, html).send(html);		
				}
			}
			fn(err, html);
			return html;
		})
	}