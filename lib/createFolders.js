var fs = require('fs'),
	path = require('path'),
	outerror = require('./Outerror'),
	baseDir = _restConfig.baseDir,
	folders = [
		 _restConfig.staticFolder,
		_restConfig.staticParseCacheFolder,
		 _restConfig.uploadFolder,
		_restConfig.logPath,
		_restConfig.tempFolder,
		_restConfig.jadeCacheFolder,
		_restConfig.ModulesFloder,
	];
folders = folders.forEach(function(value){
	var v =  value.slice(1).split('/'),
		ary = [];
	v.forEach(function(vname, i, v){
			var path = baseDir;
			for(var j = 0; j<=i; j++){
				path += '/'+v[j];
			}
			try{
				if(!path.existsSync(path)){
					fs.mkdirSync(folderName);
				}			
			}
			catch(err){
				outerror('Create folder '+path+' fail, :'+err);
			}
		});
	});

