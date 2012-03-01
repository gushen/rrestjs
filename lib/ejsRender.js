/*
*ejsRender.js 是ejs模版输出的文件
*
*/
var ejs = require('ejs'),
	RestUtils = require('./RestUtils'),
	templateRender = require('./templateRender'),
	msg =  require('./msg/msg'),
	fs = require('fs'),
	outerror = require('./Outerror');
	module.exports = function(res, view, ispage, options, fn){
		templateRender(view, ispage, function(err, iscache, html){
			if(err) RestUtils.errorRes(res, msg.resmsg.ejsRenderError);//如果有错误响应500
			else{
				if(iscache) res.send(html);//如果是缓存，则直接输出html字符串
				else{
					var html = ejs.render(html, options);//如果没开启缓存，则编译ejs模版再输出
					templateRender.tempHeader(res, html).send(html);				
				}
			}
			fn(err, html);
			return html;
		});
	}