_restConfig = require('./configRequire');
restlog = require('./RestLogger');
if(_restConfig.autoCreateFolders) var autoCreateFolders = require('./createFolders');
var RestReq = require('./RestReq')(),
	RestRes = require('./RestRes')(),
	ClusterPlus = require('./RestClusterPlus'),
	Bridge = module.exports = require('./RestBridge');
module.exports.ClusterPlus = ClusterPlus;
module.exports.AsyncProxy = require('./modules/AsyncProxy');
module.exports.mongo = require('./MongdbConnect');
module.exports.mpool = require('./MongdbConnect').mpool;
module.exports.config = _restConfig;
module.exports.mod = require('./AutoRequire');