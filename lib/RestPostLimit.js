var limit = _restConfig.postLimit,	
	postLimit = module.exports = function (req, res, callback){
		var received = 0,
			len = req.headers['content-length'] ? parseInt(req.headers['content-length'], 10) : null;
		if(!len) return callback('Post method must have a content-length http header!', req, res);
		else if(len > limit) return callback('Too big post body!', req, res);
		else return callback(null, req, res);
	};