var ejs = require('ejs'),
	RestUtils = require('./RestUtils'),
	templateRender = require('./templateRender'),
	fs = require('fs'),
	outerror = require('./Outerror');
	module.exports = function(res, view, ispage, options, fn){
		templateRender(view, ispage, function(err, iscache, html){
			if(err) RestUtils.errorRes(res, 'ejs render error!');//如果有错误响应500
			else{
				if(iscache) res.send(html);
				else{
					var html = ejs.render(html, options);
					templateRender.tempHeader(res, html).send(html);				
				}
			}
			fn(err, html);
			return html;
		})
	}