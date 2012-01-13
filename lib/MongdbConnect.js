var poolModule = require('generic-pool'),
	mongodb = require('mongodb-native'),
	outerror = require('./Outerror'),
    Db = mongodb.Db,
    Connection = mongodb.Connection,
    Server = mongodb.Server,
	connect  = mongodb.pure().connect,//字符串式连接
	connectString = _restConfig.MongodbConnectString,//字符串式连接
	defaultdbname = _restConfig.MongodbDefaultDbName,
	poolLogger = _restConfig.poolLogger,
	dbopen = function(callback, dbname){
		if(connectString){		//如果是以字符串连接数据库的
			var str = dbname || connectString;
			connect(str, function(err, db){
				callback(err, db);
			})
		}
		else{ //是以ip 和 端口 连接数据库
			 var dbname = dbname || defaultdbname;
				 dbserver =  new Server(_restConfig.MongodbIp, _restConfig.MongodbPort, {}),
				 client = new Db(dbname, dbserver, {});
				 client.open(function(err, db){
					 callback(err, db);	
				 })
		}
	};

if(_restConfig.isMongodb){  //如果开启 mongodb 连接

  var  mpool = poolModule.Pool({
        name     : 'mongodb',
        create   : function(callback, dbname){
					dbopen(callback, dbname);				   
        },
        destroy  : function(db) { db.close(); }, //当超时则释放连接
        max      : _restConfig.MongodbMaxConnect,   //最大连接数
        idleTimeoutMillis : _restConfig.MongodbCennectTimeout,  //超时时间
        log : poolLogger,  
    });

	module.exports = function(callback, dbname){
		mpool.acquire(function(err, db){
			var release = function(){mpool.release(db);}; //设置归还连接的函数
			if(err){
				outerror('Mongodb connect faild : '+ JSON.stringify(err)); //如果出错记录错误日志
				release();
			}
			callback(err, db, release);
			}, dbname)
	 }

}