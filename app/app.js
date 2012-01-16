module.exports = function(req, res){
	try{
		require('./controller/'+req.path[0])[req.path[1]](req, res);
	}
	catch(err){
		_logger.info(err)
		res.statusCode = 404;
		res.render('/e404.jade' ,{errorpath: '/'+req.path.join('/')});
	}
}