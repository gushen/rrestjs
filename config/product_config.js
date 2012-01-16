var path = require('path');
module.exports = {
//通用配置
	server:'rrestjs',     
	poweredBy: 'node.js',
	baseDir: path.join(__dirname, '/..'), //绝对目录地址，下面的目录配置都是根据这个目录拼接的
	favicon:'/favicon.ico',  //favicon存放地址
	charset: 'utf-8',
	autoStatic:'static',  //自动响应静态文件的uri，比如 http://rrestjs.com/static/rrest.jpg 将会自动响应给客户端，为了加速这里只能设置一级目录
	staticFolder:'/example/static',  //自动响应静态文件的根目录，比如  http://rrestjs.com/static/rrest.jpg 将返回 baseDir+'/example/static/rrest.jpg' 
	uploadFolder:'/tmp', //文件上传的临时目录
//cluster配置
	isCluster:true, //是否开启多进程集群
	ClusterNum:1, //开启的进程数
	ClusterReload:'/example',//只有当进程数为1时，进入开发模式，可以监听此文件夹下的改动，包括子文件夹，不用重复 ctrl+c 和 上键+enter
//静态文件配置
	statciMaxAge : 86400000*7, //静态文件的缓存周期，建议设置为7天
	staticGetOnly : true, //静态是否只能通过get获取
	staticLv2MaxAge : 1000*60*60, //静态文件2级缓存更新周期，建议设置为1小时
//session配置
	isSession:true, //是否开启session，开启会影响性能。
	syncSession:true,//当多进程时是否开启session同步，开启会影响性能。
	sessionName:'rrSid', //保存session id 的cookie 的name
	sessionExpire:false, //false表示会话session，否则填入1000*60，表示session有效1分钟
	clearSessionSetInteval:1000*60*60, //自动清理垃圾session时间，建设设置为1小时
	clearSessionTime:1000*60*60*24,//会话session超时，建议设置为1天
//session内存存储
	sessionDbStore:false,//是否使用mongodb数据库存储session，如果设置为true，则不需要同步session
//deflate和gzip配置
	isZlib:true, //是否开启delate和gizp压缩，大并发压缩虽然可以减少传输字节数，但是会影响性能
	ZlibArray:['text/plain', 'application/javascript', 'text/css', 'application/xml', 'text/html'], //只压缩数组中的content-type响应
//logger log4js 配置
	isLog:false, //是否开启日志，过多的记录日志会影响性能，但是能记录系统运行情况
	logLevel:'debug',//['trace','debug','info','warn','error', 'fatal'] 日志等级
	logPath:'/mylogs/console.log', // "/mylogs/console.log" 日志存放目录
	logMaxSize:1024*1024*10, //单个日志文件大小
	logFileNum:10, //当单个日志文件大小达标时，自动切分，这里设置最多切分多少个日志文件
//Template
	tempSet:'jade', //使用哪种页面模版
	tempFolder : '/example/static', //默认读取模版的根目录
//jade 配置
	jadeHtmlCache:true, //是否开启jade模版的html缓存，在输出模版需要大量I/O操作，且实时性要求不高时可以使用
	jadeCacheTime:1000*60*15,//模版缓存时间
	jadeCacheFolder:'/tmp/jade/', //jade模版缓存 存放目录
//mongodb 配置
	isMongodb:true, //是否开启mongodb支持，注意：如果使用数据库存储session，这里必须开启
	MongodbIp:'127.0.0.1', //mongodb地址
	MongodbPort:27017, //mongodb端口
	MongodbConnectString:false, //是否使用字符串连接，日入nae的连接方法，这个优先级高于地址+端口
	MongodbCennectTimeout:1000*30,//连接超时
	MongodbMaxConnect:100,//连接池连接数
	MongodbDefaultDbName:'rrest',//默认使用的数据库名
	poolLogger:false,//是否记录连接池的日志，建议关闭
//自动加载模块 配置
	AutoRequire:true, //是否开启模块自动加载，加载只有的模块可以使用  rrest.mod.模块名 来进行调用
	ModulesFloder:'/modules', //自动加载模块的存放目录,只读一层目录
	ModulesExcept:['exc'], //自动加载模块目录中例外不加载的模块
//ip地址访问过滤
	IPfirewall:false, //是否开启IP过滤，开启会影响性能。
	ExceptIP:/^10.1.49.224$/, //正则表达式，匹配成功表示此IP可以正常访问
	ExceptPath:['/user'],//例外的路径，如果用户访问这个路径，无论在不在ip过滤列表中，都可以正常使用
	NotAllow:'No permission!', //禁止访问响应给客户端的信息
}