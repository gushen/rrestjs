 //require kinds of config files to change environment;
 //可以用下面的几个名字，随便选一个作为config名
var configName = ['config', '_config', 'conf', '_conf', 'rrestjsconfig', 'rrestconfig',  '_rrestjsconfig', '_rrestconfig', 'appconfig', '_appconfig'],
	exobj =  module.parent.parent.parent.exports,
	exobj_keys = Object.keys(exobj);
if(exobj_keys.length === 0 ) module.exports = require('../config/config');

exobj_keys = exobj_keys.filter(function(value){
	return configName.some(function(v){
		return value === v;
	})
});

if(exobj_keys.length > 0) module.exports = exobj[exobj_keys[0]];
else module.exports = require('../config/config');  
