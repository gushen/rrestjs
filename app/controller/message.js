var home = {},
	fdate = _rrest.mod.stools.fdate,
	htmltostring = _rrest.mod.stools.htmltostring,
	check_all_param = _rrest.mod.stools.check_all_param,
	AsyncProxy = _rrest.AsyncProxy,
	ca = _rrest.mod.captcha;
home.initial = function(){ //初始化
_pool.acquire(function(err, db_connector){
		db_connector.createCollection("msg", function(err, collection){
		   collection.ensureIndex({"plus":-1,"pid":-1}, function(err, r){ //这里建立一个根据plus点数排序的索引
			   if(err) _logger.error('索引建立失败：'+err);
			   else{ 
					   _logger.info('索引建立名为：'+r);
					   collection.indexInformation(function(err,array){
						   if(!err) _logger.info('当前msg集合所有索引为：'+JSON.stringify(array))
						   _pool.release(db_connector);
					   });
				   }
			});			
		}); 
})
}();
home.getmsg = function(sorting, sname, condition, pagenum, callback){ //获取数据
	_pool.acquire(function(err, db_connector){
		db_connector.collection("msg", function(err, collection){
			var findc = sname === true? {} : (function(){
				var reg=new RegExp(sname,'i');
				return {"name":reg}})()
			if(sorting == 1){
				var sortc = {"sort":[['_id','desc']]};
				condition != true?findc._id = {"$lt":db_connector.bson_serializer.ObjectID.createFromHexString(condition)}:'';
				}
			else{
				var sortc = {"sort":[['plus','desc']]};
				condition != true?sortc.skip = parseInt(condition):'';
			}	
			sortc.limit = pagenum;//每次发送多少个
			findc.pid = 0;
			var cursor = collection.find(findc,sortc);
			cursor.count(function(err, count){
				var total = count||0;//总数
				cursor.toArray(function(err, results){
					var msgarray = results||false;//获取全部的
					var len = msgarray.length;
					if(len == 0){
						callback(err, msgarray, total);
						_pool.release(db_connector);
						return true;
					}
					var ap = new AsyncProxy(true),
					    apfunc = [],
						apall = function(){
							//_logger.info('数据获取完毕');
							callback(err, msgarray, total);
							_pool.release(db_connector);
							ap=null;
						}
					for (var j=0; j<len; j++ ){
							var func = function(order){
									collection.find({"pid":msgarray[order]._id+''}).toArray(function(err, results){
										//_logger.info(order);
										//_logger.info(results)
										msgarray[order].reply = results
										ap.rec(order, results); 
									});
							}
						   apfunc.push(func);
					}
					apfunc.push(apall);
					var t = ap.ap.apply(ap, apfunc);
					_logger.info("共有多少次异步操作："+t)
				});
		    });
			return true;
		});
 })	
}
home.index = function(req, res){
	var sorting = req.getparam['sorting'] || 1,
		sname = req.getparam['sname'] || true;
	if(parseInt(sorting) != sorting ){sorting = 1};
	if(sname != true){sname = htmltostring(sname);}
	home.getmsg(sorting, sname, true, 20, function(err, msgarray, total){
		res.render('/message/index.jade', {pagetitle:_rrest.config.webtitle+'-留言板', msg:msgarray, total:total});
	})
	return true;
}
home.more = function(req, res, pathobj){
	var sorting = req.getparam['sorting'],
		sname = htmltostring(req.getparam['sname']),
		condition = req.getparam['condition'],
		pagenum = req.getparam['pagenum'];
	if(!check_all_param(sorting, condition, pagenum)){res.send(JSON.stringify({"suc":0,"fail":"获取更多信息参数错误"}));return true;}
	sname = sname == 'true' ? true:sname;
	if(parseInt(sorting) != sorting){res.send(JSON.stringify({"suc":0,"fail":"排序参数错误"}));return true;};
	if(sname == '' || typeof sname === 'undefined'){res.send(JSON.stringify({"suc":0,"fail":"作者名错误"}));return true;};
	if(sorting == 1 && condition.length != 24){
		    res.send(JSON.stringify({"suc":0,"fail":"condition参数错误1"}));return true;
	}
	if(sorting == 2 && parseInt(condition) != condition){
		     res.send(JSON.stringify({"suc":0,"fail":"condition参数错误2"}));return true;
	}
	if(parseInt(pagenum) != pagenum){res.send(JSON.stringify({"suc":0,"fail":"pagenum参数错误"}));return true;};
	home.getmsg(sorting, sname, condition, parseInt(pagenum), function(err, msgarray, total){
		if(err){
			res.send(JSON.stringify({"suc":0,"fail":"获取失败"}));
			_logger.error('getmore错误：'+err)
		}
		else res.send(JSON.stringify({"suc":1,"msg":msgarray, "total":total}));
	})
	return true;
}
home.getcaptcha = function(req, res){
	var ac = req.getparam['a'];
	if(!check_all_param(ac)){res.send(JSON.stringify({"suc":0,"fail":"获取验证码参数错误"}));return true;}
	if(ac != 'getcap'){res.send(JSON.stringify({"suc":0,"fail":"获取验证码action错误"}));return true;}
	var sendca = function(caobj){
		if(!caobj){res.send(JSON.stringify({"suc":0,"fail":"验证码获取失败"}));return true;}
		res.send(JSON.stringify({"suc":1, "data":caobj}))
	}
	ca.creat(sendca);
	return true;
}
home.send = function(req, res){
	var name = req.getparam['name'],
		content = req.getparam['content'],
		pid = req.getparam['pid'],
		po = req.getparam['po'],
		poid = req.getparam['poid'];
	if(!check_all_param(name, content, pid, po, poid)){res.send(JSON.stringify({"suc":0,"fail":"send参数错误"}));return true;}
	if(parseInt(po) != po || parseInt(po)<0 || parseInt(po)>(ca.canum-1)){res.send(JSON.stringify({"suc":0,"fail":"位置错误"}));return true;}//用户拖拽的图片位置参数错误
	if(poid.length !== 24){res.send(JSON.stringify({"suc":0,"fail":"验证码ID错误"}));return true;}
	var sendc = function(ca_bool){
		if(!ca_bool){
			res.send(JSON.stringify({"suc":0,"fail":"验证码失败，你是非人类！"}));
			return true;
		}
		if(name.length>15){res.send(JSON.stringify({"suc":0,"fail":"用户名过长"}));return true;}
		if(content.length>150){res.send(JSON.stringify({"suc":0,"fail":"内容过长"}));return true;}
		if(!pid || pid.length !== 24){pid=0;}
		var data = {
			name : htmltostring(name),
			content : htmltostring(content),
			time : fdate('y-m-d h:m:s'),
			plus:0,
			pid:pid,
			ip:req.ip,
		}
		_pool.acquire(function(err, db_connector){
				db_connector.collection("msg", function(err, collection){
					collection.insert(data, function(err, r){
						if(err){
						   res.send(JSON.stringify({"suc":0, "fail":"提交失败"}));
						   _logger.error('提交留言失败：'+err)
						}
						else  res.send(JSON.stringify({"suc":1}));
						_pool.release(db_connector);
					});
				})	
		})
		return true;
	}
	ca.contrast(poid, po, sendc);//去验证验证码
	return true;
} 
home.del = function(req, res){//执行删除操作
	var id = req.getparam['id'];
	var pwd = req.getparam['pwd'];
	if(pwd !== 'spout2009'){res.send(JSON.stringify({"suc":0,"fail":"对不起，您没有权限"}));return true;} //这里应该有后台，这里为了简便
	if(id.length !== 24){res.send(JSON.stringify({"suc":0,"fail":"id无效"}));return true;}
	//判断合法性id的合法性和用户是否有权力
_pool.acquire(function(err, db_connector){
		db_connector.collection("msg", function(err, collection){
			collection.remove({$or:[{_id:db_connector.bson_serializer.ObjectID.createFromHexString(id)},{pid:id}]},{safe:true},function(err, r){
					if(err){
						_logger.error('删除失败，id为：'+id+'失败原因：'+err);
						res.send(JSON.stringify({"suc":0,"fail":"操作失败"}));
					}
					else res.send( JSON.stringify({"suc":1}));
					_pool.release(db_connector);
					return true;
			});
		});	
})
	return true;		
} 
home.plus = function(req, res, pathobj){ //执行+1操作
	var id = req.getparam['id'].toString();
	if(id.length !== 24){res.send(JSON.stringify({"suc":0,"fail":"id无效"}));return true;}
	//判断合法性id的合法性和用户是否有权力
_pool.acquire(function(err, db_connector){
		db_connector.collection("msg", function(err, collection){
			collection.update({'_id':db_connector.bson_serializer.ObjectID.createFromHexString(id)}, {'$inc':{'plus':1}},{},function(err, count){
			if(!err) res.send(JSON.stringify({"suc":1}));
			else{
				_logger.error('id为:'+id+'文档，plus操作失败！错误为:'+err);
				res.send(JSON.stringify({"suc":0,"fail":"操作失败"}));
				}
			_pool.release(db_connector);
			return true;
			});
		});	
})
	return true;
} 
module.exports = home; 