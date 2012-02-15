var ClusterPlus = require('./modules/ClusterPlus'),
	RestUtils = require('./RestUtils'),
	outerror = require('./Outerror'),
	isCluster = _restConfig.isCluster,
	ClusterNum = _restConfig.ClusterNum,
	CLusterLog = _restConfig.CLusterLog,
	ClusterReload = _restConfig.baseDir +_restConfig.ClusterReload; //监听改变重启的文件目录
module.exports = function(options){
	if(!isCluster) return outerror('To use ClusterPlus must let the config.isCluster open first!');
	var cpobj = {//默认配置
		logger:CLusterLog,
		num:ClusterNum,
		reload:ClusterReload,
	}
	RestUtils.merge(cpobj, options);
	return ClusterPlus(cpobj); //实例化 ClusterPlus
}
