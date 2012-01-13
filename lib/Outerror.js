var isLog = _restConfig.isLog,
    restlogger = function(message){  //错误等级error
		restlog.error(message);
	},
	restconsole = function(message){  //未开启日志功能
		console.log(message);
	};
if(isLog) module.exports = restlogger;
else module.exports = restconsole;
