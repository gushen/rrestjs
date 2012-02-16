_restConfig = require('./configRequire');
restlog = require('./RestLogger');
if(_restConfig.autoCreateFolders) var autoCreateFolders = require('./createFolders');
var RestReq = require('./RestReq')(),
	RestRes = require('./RestRes')(),
	RestBridge = module.exports = require('./RestBridge');
module.exports.AsyncProxy = require('./modules/AsyncProxy');
module.exports.mongo = require('./MongdbConnect');
module.exports.mpool = require('./MongdbConnect').mpool;
module.exports.config = _restConfig;
module.exports.mod = require('./AutoRequire');
module.exports.id = RestBridge.id;
module.exports.listen = RestBridge.listen;
module.exports.listenport = _restConfig.listenPort;