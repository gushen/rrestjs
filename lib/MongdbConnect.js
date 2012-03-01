/*
*MongdbConnect.js 是通用连接池 mongodb 数据库连接文件
*
*输出2个函数
*
*1、exports = fn，封装好的连接池函数（建议使用）
*
*2、exports.mpool 未封装的连接池函数（不建议使用）
*
*/
var poolModule = require('generic-pool'),
	mongodb = require('mongodb'),
	outerror = require('./Outerror'),
	msg =  require('./msg/msg'),
    Db = mongodb.Db,
    Connection = mongodb.Connection,
    Server = mongodb.Server,
	connect  = mongodb.pure().connect,//字符串式连接
	connectString = _restConfig.MongodbConnectString,//字符串式连接
	defaultdbname = _restConfig.MongodbDefaultDbName,
	poolLogger = _restConfig.poolLogger,
	dbopen = function(callback, dbname){
		if(connectString){		//字符串连接mongodb数据库
			var str = dbname || connectString;
			connect(str, function(err, db){
				callback(err, db);
			})
		}
		else{ //ip 和 端口 连接数据库
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
        idleTimeoutMillis : _restConfig.MongodbConnectTimeout,  //超时时间
        log : poolLogger,  
    });

	module.exports = function(callback, dbname){
		mpool.acquire(function(err, db){
			var release = function(){mpool.release(db);}; //设置归还连接的函数
			if(err){
				outerror(msg.parse(msg.errmsg.dbConnectError+dbname, err)); //如果出错记录错误日志
				release();
			}
			callback(err, db, release);
			}, dbname)
	 }
	module.exports.mpool = mpool;
}
else{
	module.exports = module.exports.mpool = function(){
		outerror(msg.errmsg.dbConfigError);//提示用户打开mongodb配置
	};
}