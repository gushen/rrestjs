var fs = require('fs'),
	outerror = require('./Outerror'),
	mod = module.exports = {},
	AutoRequire = function(){
		if(_restConfig.AutoRequire){ //如果开启自动加载
			var path = _restConfig.baseDir + _restConfig.ModulesFloder, //自动加载模块目录
				except = _restConfig.ModulesExcept;//例外
			fs.readdir(path, function(err, filearray){
				if(err) return outerror(err);
				filearray.filter(function(value){
					return !except.some(function(exc){return value.indexOf(exc) != -1;}); //过滤例外的自动加载
				}).forEach(function(value){
					if(~value.indexOf('.js')) var value = value.split('.js')[0];//去掉后缀名.js
					try{
						mod[value] = require(path+'/'+value);//加载模块
					}
					catch(err){
						outerror('coudle not require module: '+value+' ; err is : \n'+err);
					}
				})
			})
		}
		return arguments.callee;
	}();