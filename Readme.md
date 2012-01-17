# rrestjs —— HIgh performance node.js ROA  RESTFUL  web framework

##rrestjs是一款基于expressjs代码开发的高性能node.js框架，由于重新编写了框架组织架构，比expressjs整体性能提升大约10%，实用功能也更加丰富，API和代码风格相比expressjs更简单易懂

##如果想运行expamle代码，请将config文件中的config.js修改为加载example_config.js, 注: config中的除了baseDir是绝对路径外，其他路径全部都是相对于baseDir的绝对路径。

##简单的代码风格：一个hello world的例子

  var http = require('http'),

      rrest = require('rrest'),

      server = http.createServer(rrest(function (req, res) {

		res.send('hello world');

	})).listen(3000);

  目前是v1.0版本, 未经过严格测试, 目前仅供学习参考


##API
  
  api属性和方法都为小写, 加上"()"的为方法，没有的是属性。

  Request: request对象，是IncomingMessage的一个实例;
  
  Request.path: 拆分过后的uri数组,例如访问/user/face/spout, 则拆分成: ['user', 'face', 'spout'], 如果访问'/'则拆分成['index', 'index'], 会自动补足2位;

  Request.ip: 客户端访问IP地址，例如:127.0.0.1;

  Request.referer/Request.referrer: 客户端的来源, 例如用户是从谷歌搜索而来，则Request.referrer为: http://www.google.cn;

  Request.useragent: 客户端浏览器信息, 可以从中捕获IPAD或IPHONE用户等等;
  
  Request.getparam: 客户端请求get参数的对象, 比如客户端通过get请求发送了一个name=spout, 获取方法为: Request.getparam.name; //spout

  Request.postparam: 客户端请求的post参数对象,获取方法同上，如果是上传文件的，这里不能获取;

  Request.file: 客户端上传的文件对象, 包括size, name, type, path等属性，比如客户端上传了一个头像文本框name值为face, 获取方法为: Request.file.face; //{size:1024, name:'face.gif', path:'/tmp/xxxxxx', type:'image/gif', ...}

  Request.cookie: 获取客户端http请求头中的cookie对象, 获取cookie名为name, 值为spout的cookie方法为: Request.cookie.name; //spout

  Request.session: 根据sessionid, 获得客户端保存在服务端的session对象，如果没有则会自动创建session对象, 设置session值的方法为: Request.session.name = 'spout', 具体session的一些配置可去config详细配置;
 
  Request.delsession():摧毁session方法, 摧毁当前的sessionid;


  Response: response对象，是ServerResponse的一个实例
   
  Response.cache(type, maxAge): 设置请求缓存头，让浏览器对此uri请求缓存,type: public, private等, maxAge: 缓存的时间,单位毫秒; 

  Response.send(body, [statscode, iszlib, issession]): 响应客户端的请求, body: buffer或者string响应主体. statscode: 请求状态码, 默认200. iszlib: 此次响应是否开启deflate或gzip, 默认:true. issession: 本次响应是否输出cookie更新session, 默认:true;

  Response.sendjson(object, [statscode, iszlib, issession]): 用法同上，只是这里的javascript对象会转换成JSON字符串输出;

  Response.sendjsonp(content, [statscode, iszlib, issession]): 如果客户端是jsonp跨域请求, 且回调函数放在get参数callback=functionname中, 则只需将计算后的结果content传入此方法，会自动响应 functionname(content);

  Response.sendfile(filepath, [callback]): 输出文件给客户端, filepath文件存放绝对地址, callback完成后回调，两个参数err, filebuffer;(注: ranges未经严格测试)

  Response.download(filepath, [callback]): 功能同上，这里会加一个下载的http响应头

  Response.clearcookie(name): 清楚指定名称的cookie值 

  Response.cookie(name, val, [options]): 设置客户端cookie, 名/值, options:{maxAge:过期时间(毫秒), path:'/', httponly:true, domain:域名, secure:false(https上传输)};(注: 这里修正了expressjs的一个bug, 如需设置多个cookie, 多次调用此方法)

  Response.cookiep3p(): 设置cookieP3P头(注:未经严格测试);

  Response.redirect(url): 跳转到指定的url地址, 少用此功能;

  Response.render(template, [options, callback]): 目前仅支持一种jade模版，输出jade模版, template:'模版相对config设置中模版地址的地址', 比如模版地址设置为:'/temp/jade', 则输出'/user/index.jade'就相当于输出了'/temp/jade/user/index.jade', options: 传入jade模版的对象, callback: 模版输出回调两个参数err, jadestring
  
  
  AutoRequire: 自动加载 /modules 文件夹中的模块, 可以在config配置文件中详细配置开启或者例外

  require('rrestjs').mod['文件名']: 文件名会自动将后缀.js去掉, 例如在modules/as.js模块自动加载进来, 使用方法:  require('rrestjs').mod['as'];

  
  MongdbConnect: Mongodb数据库连接,可在config配置文件中详细配置, 比如: 连接数, 连接端口等等

  require('rrestjs').mongo(callback, [dbname]): callback三个参数:err, db, release方法, err表示错误, db是Mongodb数据库实例, release()方法执行表示归还连接到连接池, 操作完数据库一定要执行release(); 出错err会自动归还

  require('rrestjs').mpool(callback, [dbname]): genricpool方法, acquire.mpool(callback, dbname)表示去连接池中获取一个连接, callback接收2个参数err, db;无论err与否, 都需要mpool.release(db); 归还连接到连接池。建议使用上面的mongo方法。

  
  restlog: 全局变量, 日志对象详细配置, 例如是否开启, 如何分级, 如何切分可在config文件中详细配置

  restlog.info: 等级info日志, 测试用, 生产环境建议关闭

  restlog.warn: 等级warn, 测试用, 生产环境建议关闭

  restlog.error: 等级error, 生产环境用


##AutoStatic

  AutoStatic:自动响应静态文件, 需要去config配置, 例如: 将staticFolder设置为:'/app/static/skin', 将autoStatic设置为:'skin', 则用户只需要将图片src设置为 '/skin/face/spout.png' 即可自动响应此图片文件


##ClusterPlus

  ClusterPlus是rrestjs内置的一个多进程多任务管理模块, 主要为rrestjs提供多进程多任务, 主进程自动唤醒意外挂掉的子进程, 同步内存session以及开发模式下的自动重启.

  可以在配置文件config中详细配置ClusterPlus

  require('rrest').ClusterPlus(options): 执行ClusterPlus方法，用来进行多进程多任务处理。
  
  options设置为:

  logger:Boolean || function(str){},//布尔值，用来表示是否打开日志,或者是function，用来记录日志的方法,参数是str输出字符串, 默认关闭，建议关闭

  num:Integer, //整数，启动几个子进程, 可在config中配置

  CreateCallback:function(err, num){}, //函数，当创建子进程完成后执行，返回的参数是num整形表示第几个child，和进程ID

  DeadCallback:function(err, num){},//函数，当子进程死掉时执行，返回的参数是num整形表示第几个child，和进程ID

  RestartCallback:function(err, num){},//函数，当子进程重启时执行，返回的参数是num整形表示第几个child，和进程ID

  reload: 布尔值或者目录, //当为false时关闭自动重启功能, 否则监听指定目录, 可在config中配置

  *注意：reload只有在启动一个子进程的情况下才工作良好，并且reload会遍历监听设定目录下的所有目录，请妥善设定监听目录，默认config配置目录

  *childobj = {num:num, pid:pid}//执行ClusterPlus()返回的子进程运行情况对象

  以下是开启4个进程监听4个端口的代码, 可以将config中ClusterReload设置为一个指定目录, 一旦此目录文件发生改变将重启自动node.js进程(注: 开启此功能必须将子进程数设置为 1);

  var http = require('http'),

	rrest = require('../'),

	port = [3000, 3001, 3002, 3003],

	cp = rrest.ClusterPlus({

		CreateCallback:function(err, data){

			if(err) return console.log(err);//writen server listen function here

			var	server = http.createServer(rrest(function (req, res){

					res.send('process '+data.num+' is listen at '+port[data.num]+' : hello world everyone!');

				})).listen(port[data.num]);	
				
		},
		num:4,//also set at config.js, set one to open autoreload;

	});

  
##AsyncProxy

  AsyncProxy是一个异步代理的模块, 利用事件监听机制，并发异步处理并最终汇总处理的模块, 同时也支持异步依次处理的链式调用。

  下面是一个不定个数的异步处理的例子:
  
  var as = new require('rrestjs').AsyncProxy(), //其他代码相同，如果这里 new AsyncProxy(true), 则表示链式调用, 异步处理将依次执行, as.prev对象将能得到上一次异步处理的data数据

      asarray=[], 

      asfunc = function(data){return function(order){
      
              异步处理函数(data); //异步处理data

	      as.rec(order, data);// 将order告诉AsyncProxy表示已经此异步处理已经返回, 同时将data放入总dataall数组中, 这里还将返回一个state对象, state: {rec: 已经返回异步数, total: 总需要返回异步处理数目}
      
      }},

      asall = function(dataall){ 
      
      汇总处理(dataall);
      
      as=null;//垃圾回收一下
      
      },

      len = array.length; //注这里的array就是异步处理需要的内容
  
  while(len--){
  
      asarray.push(asfunc(array[len])); //依次将异步处理函数放入异步处理数组中
  
  }
  
  asarray.push(asall); //将最终汇总函数存入数组

  as.ap.apply(null, asarray);//as.ap方法是入口，参数规则  异步函数1, 异步函数2 ... 回调函数, 这里利用apply调用参数不定长的as.ap方法，此方法将返回一个inter型的total, 表示总共需要返回total个异步处理。

